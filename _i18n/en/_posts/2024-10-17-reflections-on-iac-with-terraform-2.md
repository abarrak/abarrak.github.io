---
title: Reflections on IaC using Terraform - Part II
tags: [Infrastructure as Code, Cloud Computing, Linux, Automation]
categories: [Automation, IaC, Cloud]
---

<img src="{{ site.baseurl_root }}/public/images/iac-reflections-2.png" class="post-image resize-sm center-image" />

This post is a follow up on [the previous one](/2022/09/23/reflections-on-iac-with-terraform) where I discussed the concept of infrastructure as code and Terraform. In this post, I will provide few useful notes I took while working on IaC projects, with examples to illustrate the techniques on two of the public providers (AWS / Oracle).

<!-- post-excerpt -->

## Tips and Tricks

1. Collect informative and actionable details about your environment [using `data` blocks](https://developer.hashicorp.com/terraform/language/data-sources).<br> Seriously no need to hardcode these ids or names, instead using `data` blocks is one way to query from the external providers, By that, the automation code quality and modularity increase a bit.

    ```bash
    # querying for references of aws vpc, and private route tables.
    data "aws_vpc" "main_vpc" {
      filter {
        name = "tag:Name"
        values = ["${var.vpc_prefix}-vpc"]
      }
    }

    data "aws_route_tables" "main_private_subnet_route_tables" {
      filter {
        name   = "vpc-id"
        values = [data.aws_vpc.vpc.id]
      }

      filter {
        name   = "tag:Name"
        values = [
          "${var.vpc_prefix}-vpc-rt-private-a",
          "${var.vpc_prefix}-vpc-rt-private-b",
          "${var.vpc_prefix}-vpc-rt-private-c",
      }
    }
    ```

    ```bash
    # query oci for dynamic routing gateway.
    data "oci_core_drgs" "main_drg" {
      compartment_id = data.main_compartment.id
    }
    ```

2. Introduce variables to dry up and factorize your environment settings.<br>
    Conventionally, the `variables.tf` file describes the specification of the configurable variables *(type, default, description)*. Then, the variables are set either on `terraform.tfvars` file, passed as command arguments, or environment variables.

    Reference the vars in your code blocks as follows`${vars.my_var}`:

    ```bash
    # variables.tf
    variable "compartment_id" {
      type = string
    }

    variable "main_ipsec_vpn_connection_routes" {
      type        = list(string)
      description = "List of one or more static route between a VPN connection and a customer gateway."
      default     = []
    }

    # tunnel.tf
    resource "oci_core_ipsec" "main_ipsec_connection" {
      compartment_id = var.compartment_id
      static_routes  = var.aws_hub_ipsec_vpn_connection_routes
    }
    ```

3. Use output to express and state unknown information till after the apply.

    ```bash
    # case from provisioned resource - aws.
    output "main_zone_id" {
      value = try(aws_route53_zone.main.zone_id, "")
    }

    # case from provisioned resource - oci.
    output "compute_instances_details" {
      description = "The summary of created instances."
      value       = module.compute_instances.instances_summary
    }

    # case from user input.
    output "vcn_cidr_range" {
      value = var.vcn_cidr_range
    }
    ```

4. Declare a variable with sensitive flag for masking in logs and execution.

    ```bash
    # redact db password from logs, and output channels.
    output "auth_token" {
      value     = random_password.db_password.result
      sensitive = true
    }
    ```

5. Add locals to shorten long configuration parts or variables chain.

    ```bash
    locals {
      availability_domain = data.oci_identity_availability_domain.ad.name

      db_name             = "${var.account_prefix]}-${var.business_unit}-db"
      db_admin_user       = "postgres"
      db_config_id           = var.db_system_default_config_id

      tags = merge(
        tomap({ Environment = var.env, Terraform   = "true"}),
        var.tags
      )
    }
    ```

6. Revise the variable types: `string`, `number`, `boolean`, `list`, `map`, and `object`.<br>
    - [Refer to the docs.](https://developer.hashicorp.com/terraform/language/expressions/types)

    ```bash
    variable "db_subnet_ingress_rules" {
      type        = list(object({ protocol = string, port = string}))
      default     = []
    }

    db_subnet_ingress_rules = [{ protocol = "6", port = "5432" }]
    ```


7. Loop through repetitive resources using `count` and `count.index`

    ```bash
    resource "aws_eip" "main_reserved_lb_ip" {
      count = 1
      tags = merge({ "Name" = "lb_reserved_ip_${count.index}"}, local.tags)
    }
    ```

8. Utilize `hashicorp/random` module to generate ids or credentials.

    ```bash
    resource "random_password" "ec2_root_password" {
      length           = 20
      special          = true
      override_special = "@!-=+"
    }
    ```

9. Import child modules into the main module using `source` attribute from various sources: <br>
local FS, git repository, github, a url, or the public terraform registry.

    ```bash
    # redshift database deployment via external module from the terraform registry.
    module "redshift-db" {
      source  = "terraform-aws-modules/redshift/aws"
      version = "3.4.1"

      cluster_identifier                  = "${var.account_prefix}-redshift-db"
      cluster_node_type                   = "dc2.large"
      cluster_number_of_nodes             = 2
      encrypted                           = true
      automated_snapshot_retention_period = 5

      cluster_database_name   = "redshift-db"
      cluster_master_username = "rd-db-user"
      cluster_master_password = random_password.rd_db_pass.result

      wlm_json_configuration       = jsonencode([{ auto_wlm = true }])
      enable_user_activity_logging = true
      owner_account                = ""
      final_snapshot_identifier    = "${var.account_prefix}-final-snapshot"

      cluster_iam_roles = [
        local.s3_iam_role.iam_role_arn
      ]

      subnets = data.aws_subnets.private_subnets
      enhanced_vpc_routing = true
      publicly_accessible  = true
      vpc_security_group_ids = [module.main_networking.main_sg.id]
      enable_logging = true

      tags = {}
    }
    ```

10. When using multiple modules structure, variables can be passed around in `module` block.

    ```bash
    module "postgres" {
      source           = "../../base-modules/oci/postgres"
      compartment_id   = var.compartment_id
      tenancy_id       = var.tenancy_id
      db_name          = var.postgres_db_name
      tags             = var.tags
      # etc ...
    }
    ```


11. Use `for_each` iteration primitives (`.key`, `value.*`) for granular data structure looping over sets.

    ```bash
    # basic looping.
    data "aws_subnet" "public_subnet" {
      for_each = toset(data.aws_subnets.public_subnets.ids)
      id       = each.value
    }

    # basic looping with mapping.
    resource "aws_route53_record" "main_zone_cnames" {
      for_each = { for r in var.main_public_cnames : i[0] => { target : r[1], ttl : r[2] }}

      zone_id = aws_route53_zone.main.id
      type    = "CNAME"
      name    = each.key
      ttl     = each.value.ttl
      records = [each.value.target]

      depends_on = [
        aws_route53_zone.main_zone
      ]
    }

    # advanced example.
    resource "aws_route" "private_subnets_vpn_routes" {
      for_each = length(var.ipsec_vpn_connection_routes) == 0 ? {} : {
        for pair in setproduct(
          data.aws_route_tables.private_subnet_route_tables.ids,
          var.ipsec_vpn_connection_routes
        ) : "route-entry.${pair[0]}.${pair[1]}" => { rt_id = pair[0], dest_cidr = pair[1] }
      }
      route_table_id         = each.value.rt_id
      destination_cidr_block = each.value.dest_cidr
      gateway_id             = aws_vpn_gateway.ipsec_vpn_gateway.id
    }
    ```

12. review  the built-in functions of interest to your configurations: <br>
    `tolist()`, `toset()`, `upper()`, `join()`, `lower()`, `max()`, `endswith()`, `chomp()`, `regex()`, `map()`, `reverse()`, `flatten()`, `file()`, `base64*()`, `timestamp()`, and much more.

    ```bash
    locals {
      normalized_prefix = lower(var.account_prefix)
    }

    provider "kubernetes" {
      host                   = data.aws_eks_cluster.main.endpoint
      token                  = data.aws_eks_cluster_auth.main.token
      cluster_ca_certificate = base64decode(data.aws_eks_cluster.main.certificate_authority.0.data)
    }
    ```

    They come in handy during your IaC development and can helps solving many problems.<br>
    [Refer to the docs here.](https://developer.hashicorp.com/terraform/language/functions)


13. You can add validation rules and message to your module vars in `variables.tf`.<br>
    Here's an example:

    ```bash
    variable "vpc_prefix" {
      type = string
      validation {
        error_message = "vpc_prefix should be less than 10 characters."
        condition     = length(var.vpc_prefix) < 10
      }
    }

    variable "db_system_storage_iops" {
      description = "OCI DbSystem Performance Unit"
      default     = "300000"
      type        = string
      validation {
        condition = contains(["300000", "750000"], var.db_system_storage_iops)
        error_message = "Currently, the only supported performance tier are 300,000, and 750,000 IOPS."
      }
    }
    ```

14. Use the state CLI command to show, list, or manipulate the state once needed *(e.g. checking existing values, importing directly modified items outside IaC, etc.)*.

    ```bash
    # view the current state items.
    terraform state list

    # importing specific item that was done outside terraform
    terraform state rm "aws_customer_gateway.ipsec_gateway_cpe"
    terraform import "aws_customer_gateway.ipsec_gateway_cpe" "cgw-XXXXXX"
    ```

15. Use `terraform console` to quickly experiment with `HCL` syntax and explore the current module data.

    ```bash
    # testing sort function for an IPs list.
    ❯ terraform console                                                                                                                      infra-terraform/git/master
    > tolist(concat(sort(["10.200.18.0/24", "10.34.150.0/24", "10.10.100.0/25" ])))
    tolist([
      "10.10.100.0/25",
      "10.200.18.0/24",
      "10.34.150.0/24",
    ])
    ```
<br>

Although, terraform and `HCL` definition language may have some limitation around dynamic behavior sometimes, you will find ways to structure and approach your automation code declaratively, most of the time!

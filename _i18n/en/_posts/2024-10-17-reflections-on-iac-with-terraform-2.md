---
title: Reflections on IaC using Terraform - Part II
tags: [Infrastructure as Code, Cloud Computing, Linux, Automation]
categories: [Automation, IaC, Cloud]
---

<img src="{{ site.baseurl_root }}/public/images/iac-reflections-2.png" class="post-image resize-sm center-image" />

This post is a follow up on [the previous one](/2022/09/23/reflections-on-iac-with-terraform) where I discussed the concept of infrastructure as code and Terraform. In this post, I will provide few useful notes I took while working on IaC projects, with examples to illustrate the techniques on two of the public providers (AWS / Oracle).

<!-- post-excerpt -->

<blockquote>
🔖 &nbsp; <b>Note:</b> I'm using whitespace freely to break long lines, which is in most cases not allowed in HCL statements.
</blockquote>

## Tips and Tricks


1. Collect informative and actionable details about your environment [using `data` blocks](https://developer.hashicorp.com/terraform/language/data-sources).<br> Seriously no need to hardcode these ids or names, instead using `data` blocks is one way to query from the external providers, By that, the automation code quality and modularity increase a bit.

    Here are examples showing how to query for some network resources.

    ```java
    data "aws_vpc" "apps" {
      filter {
        name = "tag:Name"
        values = ["apps-vpc"]
      }
    }

    data "aws_route_tables" "apps" {
      filter {
        name   = "vpc-id"
        values = [
          data.aws_vpc.apps_vpc.id
        ]
      }

      filter {
        name   = "tag:Name"
        values = [
          "*rt-private-a",
          "*rt-private-b",
          "*rt-private-c",
      }
    }
    ```

    ```bash
    data "oci_core_drgs" "my_drg" {
      compartment_id = data.comp.id
    }
    ```


2. Introduce variables to dry up and factorize your environment settings.<br>
    Conventionally, `variables.tf` file describes the specification of the configurable variables *(type, default, description)*. Then, the variables are set either in `terraform.tfvars` file, passed as command arguments, or environment variables.

    Reference the vars in your code blocks as follows`${vars.my_var}`:

    ```bash
    # variables.tf
    variable "c_id" {
      type = string
    }

    variable "routes" {
      type        = list(string)
      description = "VPN routes."
      default     = []
    }

    # tunnel.tf
    resource "oci_core_ipsec" "vpn" {
      compartment_id = var.c_id
      static_routes = var.routes
    }
    ```

3. Use output to express and state unknown information till after the apply.

    ```bash
    # user input
    output "vpc_cidr_range" {
      value = var.vpc_cidr_range
      description = "IPs CIDR."
    }

    # provisioned resource - aws
    output "main_zone_id" {
      value = try(
        aws_route53_zone.m.zone_id,
        ""
      )
    }

    # provisioned resource - oci
    output "instances_details" {
      value = module.ci.instances_summary
    }
    ```

4. Declare a variable with sensitive flag for masking in logs and execution.

    ```bash
    output "auth_token" {
      sensitive = true
      value = random_password.pass.result
    }
    ```

5. Add locals to shorten long configuration parts or variables chain.

    ```bash
    locals {
      ad = data.oci_identity_availability_domain.ad.name

      db_name = "${var.prefix]}-db"
      db_admin_user = "postgres"
      conf_id = var.db_config_id

      tags = merge(
        tomap({ Env = var.env }),
        var.tags
      )
    }
    ```

6. Revise the variable types: `string`, `number`, `boolean`, `list`, `map`, and `object`.

    ```bash
    variable "db_ingress_ports" {
      type = list(object( { port = string } ))
    }

    db_ingress_ports = [
      { port = "5432" }
    ]
    ```

    [Refer to the docs for more.](https://developer.hashicorp.com/terraform/language/expressions/types)

7. Loop through repetitive resources using `count` and `count.index`

    ```bash
    resource "aws_eip" "eips" {
      count = 1
      tags = merge({ "Name" = "lb_ip_${count.index}" }, local.tags)
    }
    ```

8. Utilize `hashicorp/random` module to generate ids or credentials.

    ```bash
    resource "random_password" "ec2" {
      length = 20
      special = true
      override_special = "@!-=+"
    }
    ```

9. Import child modules into the main module using `source` attribute from various sources: <br>
local FS, git repository, github, a url, or the public terraform registry.

    ```bash
    # redshift database deployment,
    # via external module from the
    # registry.
    #
    module "redshift-db" {
      source = "terraform-aws-modules/redshift/aws"
      version = "3.4.1"

      cluster_identifier = "rd"
      cluster_number_of_nodes = 2
      cluster_node_type =
        "dc2.large"

      cluster_database_name = "rd"
      cluster_master_username =
        "rd-user"
      cluster_master_password =
        random_password.pass.result

      encrypted = true
      wlm_json_configuration =
        jsonencode([
          { auto_wlm = true }
        ])

      cluster_iam_roles = [
        local.s3_role.iam_role_arn
      ]

      subnets = data.aws_subnets.a

      enhanced_vpc_routing = true
      publicly_accessible  = true
      vpc_security_group_ids = []
      enable_logging = true

      tags = {}
    }
    ```

10. When using multiple modules structure, variables can be passed around in `module` block.

    ```bash
    module "postgres" {
      source = "../base/oci_pg"

      tenancy_id = var.tenancy_id
      db_name = var.postgres_db_name

      tags = var.tags
      # etc ...
    }
    ```


11. Use `for_each` iteration primitives (`.key`, `value.*`) for granular data structure looping over sets.

    ```bash
    # basic looping.
    data "aws_subnet" "subnet" {
      for_each = toset(
        data.aws_subnets.all.ids
      )
      id = each.value
    }

    # basic looping with mapping.
    resource "aws_route53_record" "cnames" {
      for_each = {
        for r in var.public_cnames :
        r[0] => {
          target : r[1], ttl : r[2]
        }
      }

      zone_id =
        aws_route53_zone.main.id
      type    = "CNAME"
      name    = each.key
      ttl     = each.value.ttl
      records = [each.value.target]

      depends_on = [
        aws_route53_zone.main
      ]
    }

    # advanced example.
    resource "aws_route" "private_subnets_vpn_routes" {
      for_each = {
        for i in setproduct(
        data.aws_route_tables.private.ids, var.vpn_route) :
        "entry.${i[0]}.${i[1]}" => { rt_id = i[0], dest_cidr = i[1] }
      }

      gateway_id =
        aws_vpn_gateway.vgw.id
      route_table_id =
        each.value.rt_id
      destination_cidr_block =
        each.value.dest_cidr
    }
    ```

12. review  the built-in functions of interest to your configurations: <br>
    `tolist()`, `toset()`, `upper()`, `join()`, `lower()`, `max()`, `endswith()`, `chomp()`, `regex()`, `map()`, `reverse()`, `flatten()`, `file()`, `base64*()`, `timestamp()`, and much more.

    ```bash
    locals {
      prefix = lower(var.acc_prefix)
    }
    ```

    ```bash
    provider "kubernetes" {
      cluster_ca_certificate =
        base64decode(
          data.aws_eks_cluster.main.ca.0.data
        )
    }
    ```

    They come in handy and can help solving several problems. <br>[Refer to the docs here.](https://developer.hashicorp.com/terraform/language/functions)


13. You can add validation rules and message to your module vars in `variables.tf`.<br>
    Here's an example:

    ```bash
    variable "prefix" {
      type = string

      validation {
        condition =
          length(var.prefix) < 10
        error_message =
          "only less than 10 chars."
      }
    }

    variable "db_storage_iops" {
      type = string
      default = "300000"

      validation {
        condition = contains(
          ["300000", "750000"],
          var.db_storage_iops
        )
        error_message =
          "Only IOPS: 300K / 750K."
      }
    }
    ```

14. Use the state CLI command to show, list, or manipulate the state once needed *(e.g. checking existing values, importing directly modified items outside IaC, etc.)*.

    ```bash
    # view the current state items.
    terraform state list

    # clean outdated state.
    terraform state rm \
     "aws_customer_gateway.main"

    # importing drifted state.
    terraform import \
      "aws_customer_gateway.main" \
      "cgw-new-id-XXX"
    ```

15. Use `terraform console` to quickly experiment with `HCL` syntax and explore the current module data.

    ```bash
    # testing sorting out lists.
    ❯ terraform console
    >
    > tolist(concat(sort(
      ["10.200.18.0/24",
       "10.34.150.0/24",
       "10.10.100.0/25"]
      )))
    tolist([
      "10.10.100.0/25",
      "10.200.18.0/24",
      "10.34.150.0/24",
    ])
    >
    ```

### Final Thought ..

Although, terraform and `HCL` definition language may have limitation around dynamic behavior sometimes, you will find ways to structure and approach your automation code declaratively, most of the time.

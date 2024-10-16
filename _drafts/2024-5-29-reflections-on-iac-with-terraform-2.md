---
title: Reflections on IaC using Terraform - Part II
tags: [Infrastructure as Code, Cloud Computing, Linux, Automation]
categories: [Automation, IaC, Cloud]
---

<img src="{{ site.baseurl_root }}/public/images/iac-reflections-2.png" class="post-image resize-sm center-image" />

This post is a follow up on [the previous one](/2022/09/23/reflections-on-iac-with-terraform) where I discussed the concept of infrastructure as code and Terraform. In this one, I list down few notes I took while working on IaC projects, with related examples to illustrate.

<!-- post-excerpt -->

## Tips and Tricks

1. Collect informative and actionable details about your environment from the external sources of providers [using `data` blocks](https://developer.hashicorp.com/terraform/language/data-sources). Seriously no need to hardcode these ids or names. Using `data` blocks is one way, and by that the code quality and modularity increase a bit.

```bash
# querying for references of aws vpc and some route tables.
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
data "oci_core_drgs" "hub_drg" {
  compartment_id = data.main_compartment.id
}
```

2. Introduce variables to dry up and factorize your environment settings. Conventionally, the `variables.tf` describes the specification of the configurable variables (type, default, description). Then, the variables are set either on `terraform.tfvars`, passed as command arguments, or environment variables. Reference the vars in your code blocks `${vars.my_var}`.


3. Use output to express and state unknown information after apply.

```bash
# from provisioned resource - aws.
output "main_zone_id" {
  value = try(aws_route53_zone.main.zone_id, "")
}

# from provisioned resource - oci.
output "compute_instances_details" {
  description = "The summary of created instances."
  value       = module.compute_instances.instances_summary
}

# from user input.
output "vcn_cidr_range" {
  value = var.vcn_cidr_range
}
```

4. Declare a variable with sensitive flag for masking in logs, and execution.

```bash
output "auth_token" {
  value     = random_password.db_password.result
  sensitive = true
}
```

5. Add locals to shorten long configuration parts or variable chain.

```bash

```

6. Revise the variable types: `string`, `number`, `boolean`, `list`, `map`, and `object`.

https://developer.hashicorp.com/terraform/language/expressions/types

7. Import child modules into the main using `source` attribute from various sources: local FS, git, github, url, or tf registry.

8. When using multiple modules structure, variables can be passed around in `module` block.

9. Loop through repetitive resources using `count` and `count.index`

10. Utilize `hashicorp/random` module to generate ids or credentials.

11. Use `for_each = something` and `each` iteration primitive (.key, .value, value.*) for granular data structure looping over sets.

12. review  the built-in functions of interest to your configurations: `tolist()`, `toset()`, `upper()`, `join()`, `lower()`, `max()`, `endswith()`, `chomp()`, `regex()`, `map()`, `reverse()`, `flatten()`, `file()`, `base64*()`, `timestamp()`, and much more.

They come in handy during your IaC development and can helps solving many problems.<br>
Refer to the docs: https://developer.hashicorp.com/terraform/language/functions.


13. You can add validation rules and message to your module vars in `variables.tf`.

Here's an example:

```terraform
```

14. Use the state cli command to show, list, or manipulate the state once needed (e.g. checking existing values, importing directly modified items outside IaC, etc.).

```bash
```

15. Use `terraform console` to quickly experiment with HCL and terraform features and explore the current module data.

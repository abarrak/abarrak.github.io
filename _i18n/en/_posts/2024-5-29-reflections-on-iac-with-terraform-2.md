---
title: Reflections on IaC using Terraform - Part II
tags: [Infrastructure as Code, Cloud Computing, Linux, Automation]
categories: [Automation, IaC, Cloud]
---

<img src="{{ site.baseurl_root }}/public/images/iac-reflections-2.png" class="post-image resize-sm center-image" />

This post is a follow up on [the previous one](/2022/09/23/reflections-on-iac-with-terraform) where I disscussed infrastructure as code concepts and how Terraform is approaching this area.

<!-- post-excerpt -->

```bash
```

## Tips and Tricks

1. Collect informative and actionable details about your environment from the external sources of providers [using `data` blocks](https://developer.hashicorp.com/terraform/language/data-sources) Seriously no need to hardcode these ids or names, and using `data` references increases the code quality a bit.

2. Introduce variables to dry up and factorize your environment details, and custom settings. .. `variables.tf` describes the var lists blueprint and their spec (type, default, desc).  .. Then variables are set either on terraform.tfvars, command args, or env vars.Reference the vars in code blocks that are factorized `${vars.my_var}`.

3. Use output to express and state unknown info till apply.

4. Declare a variable with sensitive flag for masking in logs, and execution.

5. Add locals to shorten long configuration parts or variable chain.

6. Revise the variable types:  string, number, boolean, list, map, object.https://developer.hashicorp.com/terraform/language/expressions/types

7. Import child modules into the main using `source` attribute from various sources: local FS, git, github, url, or tf registry.

8. When using multiple modules structure, variables can be passed around in `module` block.

9. Loop through repetitive resources using `count` and `count.index`

10. Utilize `hashicorp/random` module to generate ids or credentials.

11. Use `for_each = something` and `each` iteration primitive (.key, .value, value.*) for granular data structure looping over sets.

12. review  the built-in functions of interest to your configurations: tolist(), toset(), upper(), join(), lower(), max(), join(), endswith(), chomp(), regex(), map(), reverse(), flatten(), file(), base64*(), timestamp(), and much more..https://developer.hashicorp.com/terraform/language/functions

13. You can add validation rules and message to the vars in variables.tf.

14. Use the state cli command to show, list, or manipulate the state once needed (e.g. importing directly modified items outside IaC).

15. Use `terraform console` to quickly experiment with HCL and terraform features and explore the current module data.

---
title: Reflections on IaC using Terraform
tags: [Infrastructure as Code, Cloud Computing, Linux, Automation]
categories: [Automation, IaC, Cloud]
---

<img src="{{ site.baseurl_root }}/public/images/iac-reflections.png" class="post-image resize-md center-image" />

Terraform has emerged as one of the top open source infrastructure as code (IaC) tools, since its initial release by Hashicorp back in 2014.

The design philosophy behind the tool is to have **declarative**, and **stateful** representation for the underlying IT infrastructure (whether it be on public, on-premise, or hybrid cloud), which in turns simplify the control, collaboration, and auditing of such resources.

The classical example for provisioning AWS EC2 instance concisely captures the design principles.

<!-- post-excerpt -->

```bash
provider "aws" { }

resource "aws_vpc" "example" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_instance" "example_ec2" {
  ami = "ami-026b57f3c383c2eec"
  instance_type = "t2.micro"
  tags = {
    Name = "New example instance"
  }
}
```

This is not limited to only compute resources, [many of AWS services are available as well](https://registry.terraform.io/providers/hashicorp/aws/latest/docs).

### Simplified Workflow

The main workflow is conventionally promoted, which is an essential feature:

<img src="{{ site.baseurl_root }}/public/images/terraform-diagram.png" class="post-image-2 resize-md center-image" />

The flow maps cleanly to CLI commands:

```bash
terraform init
terraform plan
terraform apply
terraform show
```

Additional linting commands available as well:

```bash
terraform fmt
terraform validate
```

Disposal of resources is simplified as well (without authoring `.tf` manifests):

```bash
terraform destroy
```

### Structure

It's recommended to factorize input values across environments into `variable` sections.
<br>
This as well allows for security aspects implementation, like protecting sensitive data.

Moreover, `output` blocks provide a way to capture and log information after applying state changes.

The minimal structure of managed resources in terraform is shown below:

```bash
$ tree
├── main.tf
├── outputs.tf
├── terraform.tfstate
├── terraform.tfstate.backup
└── variables.tf
```

The  variables and output files are separated to organize things up.

Finally, the state is tracked in `.tfstate` file  managed internally by Terraform.


### Providers

The mechanism behind provisioning the intended state of an infrastructure or platform, is carried on by **"providers"**. which are simply extensions written in `Go` language and expose the resource types they implement, interfacing with the target infrastructure/platform APIs.

```apl
provider "aws" {
  region = "us-east-1"
}
```

Major cloud providers [are available in the public terraform registry](https://registry.terraform.io), along with many of platform agnostic plugins, such as `Helm` and `Kubernetes`.

<img src="{{ site.baseurl_root }}/public/images/providers-iac.png" class="post-image-2 resize-md center-image" />


Here's an example for a simple helm releasing technique to build on:

```bash
provider "helm" {
  kubernetes { }
}

resource "helm_release" "redis" {
  name       = "redis-instance"

  repository = "https://charts.bitnami.com/bitnami"
  chart      = "redis"

  set {
    name  = "architecture"
    value = "replication"
  }
}
```


### Terraform v.s. Ansible

Compared to Ansible as an orchestration tool on the infrastructure layer, I find that Terraform overall is more expressive and concise to enable building on modules in much elegant and feasible manner, with the excellent readability of HCL and dependency management of plugins.

The state is a major difference to consider too.

Ansible takes a stateless approach by always exchanging the desired state with the target resources in order to know the actual state then apply the delta, if needed. On the other hand, Terraform is stateful and manages the state in local or remote manner.

### Summary

All in all, codifying infra and platform layers (e.g. using terraform) has a key benefit to organizations in adopting the DevOps practices which leads to operational excellence, eventually.

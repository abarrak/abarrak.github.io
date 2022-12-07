---
title: Ansible Roles and Reusability
tags: [Infrastructure as Code, Linux, Automation]
categories: [Automation, IaC, Linux]
---

<img src="{{ site.baseurl_root }}/public/images/ansible.png" class="post-image resize-md center-image" />

Reuse and module sharing in Ansible can be achieved through two methods: A "Role" which forms conceptually a single component and its related tasks. Second, "Content Collections" which form what we could consider as a namespace having a group of roles, in addition to "plugins" that provide the ability to craft custom modules.

Here's a list of some roles I have published into the galaxy over the past months:

<!-- post-excerpt -->

### 1. Docker Server

  This roles differs from others in the community by the support to expose TCP/SSH socket for the docker daemon to allow external docker clients to build and use the server as centralized containers engine. Additionally, supports connecting to external image registries by setting the needed variables.

- [Link](https://galaxy.ansible.com/abarrak/docker_server_role) - [Source](https://github.com/abarrak/docker-server-role)

### 2. Plik Server

  A temporary file upload system with minimal GUI.

- [Link](https://galaxy.ansible.com/abarrak/plik_ansible_role) - [Source](https://github.com/abarrak/plik-ansible-role)

### 3. Redis

  This is merely a wrapper to deploy Bitnami's redis chart to Kubernetes cluster.

- [Link](https://galaxy.ansible.com/abarrak/redis_ansible_role) - [Source](https://github.com/abarrak/redis-ansible-role)

### 4. Samba

   I wrote this role to learn and experiment with the protocol. Mainly, translated from [this article](https://www.redhat.com/sysadmin/getting-started-samba).

- [Link](https://galaxy.ansible.com/abarrak/samba_ansible_role) - [Source](https://github.com/abarrak/samba-ansible-role)

That's it. I hope you find it insightful.

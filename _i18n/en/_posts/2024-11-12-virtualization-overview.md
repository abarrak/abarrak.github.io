---
title: A Short Essay on Popular Virtualization Technologies
tags: [virtualization]
categories: [Virtualization, Operating Systems]
---

This post reviews four main virtualization options in short.<br>

<blockquote>
💡 VM technologies are essentially considered by people when addressing on-premise use cases or when building DR for data centers.
</blockquote>

### VMware Virtualization

* Started at (2003).

* Offers type-1 hypervisor that runs on bare-metal called <span class="key-text">ESXi</span> with minimum disk image footprint (32MB), with resources, storage, and networking capabilities, and UI console <span class="key-text">(DCUI)</span>.

<!-- post-excerpt -->

* Includes distributed management system <span class="key-text">(vCenter)</span> for managing ESXi hosts, access control, migration (vMotion), HA, and distrusted resource scheduler (DRS).

* <span class="key-text">vSphere client</span> UI: A web client for managing multiple ESXi hosts and vCenter resources.

<figure>
  <img src="{{ site.baseurl_root }}/public/images/virtualization-1.png" class="post-image-2 resize-md center-image">
  <figcaption>Fig.1: Outline setup for VMware.</figcaption>
</figure>

### KVM

* Started at (2007).

* Linux based kernel virtual machines.

* Free and open-source .

* Basically, it's a kernel module that allows the kernel to function as a hypervisor.

* Originally designed for x86 processors then ported to others (ARM, ESA/390, PowerPC).

* Supports <span class="key-text">HAV</span> (hardware-assisted virtualization).

* [Libvirt](https://libvirt.org/) is an abstraction library which facilitates working with KVM toolchains and its adapters.

* License: GNU GPL v2.

<figure>
  <img src="{{ site.baseurl_root }}/public/images/virtualization-2.png" class="post-image-2 resize-md center-image">
  <figcaption>Fig.2: KVM Internal Design.</figcaption>
</figure>


### Red Hat Virtualization

* Started at (2009).

* An enterprise solution based on Linux KVM.

* Has integrations with AD and FreeIPA for domain and access control.

* Servers management UI.

* Superseded by OpenShift, now in maintenance mode since 2020.

<figure>
  <img src="{{ site.baseurl_root }}/public/images/virtualization-3.png" class="post-image-2 resize-md center-image">
  <figcaption>Fig.3: RedHat virtual manager UI.</figcaption>
</figure>

### Hyper-V

* Started at (2008) by Microsoft.

* A native hypervisor for x86-64 systems only.

* Separates VMs using isolated partitions running their guest OSs.

* A single hyper-v with command line (CMD) is free.

* Requires <span class="key-text">HAV</span> (hardware-assisted virtualization).

<figure>
  <img src="{{ site.baseurl_root }}/public/images/virtualization-4.png" class="post-image-2 resize-md center-image">
  <figcaption>Fig. 4: Hyper-V overview.</figcaption>
</figure>

<figure>
  <img src="{{ site.baseurl_root }}/public/images/virtualization-5.png" class="post-image-2 resize-md center-image">
  <figcaption>Fig. 5: Installation screen for Hyper-V 2019.</figcaption>
</figure>

### OpenStack

* The largest open source cloud infrastructure solution.
* Split to multiple components such as: [Cinder](https://docs.openstack.org/cinder/latest/) (storage), [Nova](https://github.com/openstack/nova) (compute), and [Neutron](https://docs.openstack.org/neutron/latest/) (networking).
* OpenStack requires dedicated review for it is own. <br>
  [The main reference](https://www.openstack.org/software/), and here's a [good comparision article between it and hyper-V](https://blog.purestorage.com/purely-educational/hyper-v-vs-openstack-a-comprehensive-comparison-of-virtualization-platforms/) for virtualization cases.

<figure>
  <img src="{{ site.baseurl_root }}/public/images/virtualization-6.png" class="post-image-2 resize-md center-image">
  <figcaption>Fig. 6: OpenStack.</figcaption>
</figure>


#### <b>Takeaway:</b>

VMware stands out as enterprise solution for corporate and regularity requirements, especially when the support is a must. Conversely, for small projects and applications, I find KVM-QEMU based setup a good option.

Finally, for building on-premise solution on top of open technologies, **OpenStack is the obviously viable option**.

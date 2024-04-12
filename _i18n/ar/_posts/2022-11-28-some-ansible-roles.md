---
title: آنسبل جالكسي ونشر الوحدات (Roles)
tags: [لينكس, الأتمتة]
categories: [الأتمتة, لينكس]
---

<img src="{{ site.baseurl_root }}/public/images/ansible.png" class="post-image resize-md center-image" />

يدعم محرك آنسبل نشر ومشاركة وحدات الأتمتة عبر (Ansible Galaxy) لكل من الوحدات (Roles)، والمجموعات (Collections).

هذه قائمة لبعض الوحدات (Roles) نشرتها للمستودع العام (Ansible Galaxy) خلال الأشهر الماضية:

<!-- post-excerpt -->

### 1. سيرفر دوكر
  تختلف عن الوحدات الموجودة مسبقاً بدعم النشر العام لسيرفر دوكر عبر (TCP/SSH)، مما يسمح باستخدامه للبناء والربط خارجياً.

  أيضاً، تم تسهيل إعداده بحيث يرتبط مع مستودعات دوكر (Image registries).

- [الرابط](https://galaxy.ansible.com/abarrak/docker_server_role)

### 2. بلْيك

  نظام رفع ملفات مؤقت مع واجهة مستخدم مبسطة.

  - [الرابط](https://galaxy.ansible.com/abarrak/plik_ansible_role).

### 3. ريدس

  هذه الوحدة عبارة عن تسهيل لنشر نظام التخزين المؤقت redis لمنصة كوبرنتيس، وتعتمد على نسخة بِتْ نامي (helm chart).

- [الرابط](https://galaxy.ansible.com/abarrak/redis_ansible_role).

### 4. سامبا

  كتبتها بقصد تعلم وتجربة بروتوكول (Samba). مستمدة أساساً من [هذه المقالة](https://www.redhat.com/sysadmin/getting-started-samba).

  - [الرابط](https://galaxy.ansible.com/abarrak/samba_ansible_role).

أرجو أن تقدم الفائدة للمهتمين بأحد هذه البرمجيات!

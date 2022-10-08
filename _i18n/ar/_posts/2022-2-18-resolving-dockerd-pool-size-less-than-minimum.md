---
title: حل مشكلة إنشاء الحاويات لخادم دوكر بسبب المساحة (Pool Size Limit)
tags: [cicd, pipelines, ddevmapper pool issue, dockerd, docker]
categories: [برمجيات, CICD, دوكر]
---

<br>
<img src="{{ site.baseurl_root }}/public/images/dockerd-ddevmapper-pool-issue.png" class="post-image resize-md center-image" />

## المشكلة

من المتوقع المرور بعدد من المشكلات في أنظمة البناء والترابط (CI/CD) المعتمدة على دوكر (Docker)، وذلك نتيجةً لبعض القيود المعتادة في هذه البيئات، ولِمعمارية الخادم والعميل الأساسية في دوكر.

أدناه إحدى هذه المشكلات تعاملت معها مؤخراً. وهي تحصل أثناء اتصال النظام بـ الخادم `dockerd` من أجل بناء نماذج وحاويات تطبيق معين (Images)، أو جلْب نماذج موجودة خارجياً. يظهر نص الخطأ كالتالي:

```
failed to prepare a4mv4dh8qcq283c7x47a4nwpg: devmapper: Thin Pool has 161986 free data blocks which is less than minimum required 163840 free data blocks. Create more free space in thin pool or use dm.min_free_space option to change behavior
```

<!-- post-excerpt -->

## التحققات

كما يظهر في عبارة الخطأ, تتعلق المشكلة بالوصول لاستهلاك كامل المساحة المحددة لمحرك التخزين لخادم دوكر [device mapper driver](https://docs.docker.com/storage/storagedriver/device-mapper-driver/). ويتضح  وجود نقص  في مساحة `Thin Pool` أدى لفشل إنشاء أو جلْب النماذج الجديدة.

للتأكد, بالإمكان التحقق من مساحة القرص للخادم `df -H` أو أوامر `docker system`.

```shell
docker system info
docker system df
```

## حلول

1. كحلٍ مؤقت، زيادة مساحة التخزين المتاحة لدوكر ستقوم بإزالة المشكلة، إن أمكننا التحكم بالمساحات وزياداتها.

2. أيضاً، بالإمكان إجراء عمليات المسح الدوري لنماذج الحاويات غير المستخدمة يدوياً أو عبر إجراءات مجدولة (crontab).

 ```shell
# delete specific unused images by pattern:
IMAGES=my-apps
docker images | grep $IMAGES | awk '{print $1 ":" $2}' | xargs docker rmi
 ```

 يمكن الحذف بواسطة [تحديد عنوان أو تاريخ معين](https://docs.docker.com/engine/reference/commandline/image_prune/#filtering):

 ```shell
# delete 6 months old images:
docker image prune -a --force --filter "until=4368h"
 ```

وأيضاً، بإمكاننا إجراء الأمر `prune` لمحو كافة المصادر غير المستعملة أو المنتهية:

 ```shell
docker system prune

# This will remove all unused images:
docker image prune --all
 ```

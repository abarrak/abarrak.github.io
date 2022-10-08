---
title: Resolving Image Creation Failure on DockerD due Pool Size Limit
tags: [cicd, pipelines, ddevmapper pool issue, dockerd, docker]
categories: [Software, CICD, Docker]
---

<br>
<img src="{{ site.baseurl_root }}/public/images/dockerd-ddevmapper-pool-issue.png" class="post-image resize-md center-image" />


## Problem

Sometimes, when working with docker engine on CI systems, certain type of errors could arise from the challenging restrictions or limits on the environment. This is typical with the inherent server-client architecture of docker.

Here's one of the problems that I've seen recently. When a client is connecting to `dockerd` in order to build an application image or prepare and pull external images, the server reports this issue:

```
failed to prepare a4mv4dh8qcq283c7x47a4nwpg: devmapper: Thin Pool has 161986 free data blocks which is less than minimum required 163840 free data blocks. Create more free space in thin pool or use dm.min_free_space option to change behavior
```

<!-- post-excerpt -->

## Analysis

As the log suggests, clearly this is related to the storage limit incurred for the [device mapper driver](https://docs.docker.com/storage/storagedriver/device-mapper-driver/). Here, `Thin Pool` needs additional space to create or pull newer images but the limit is exceeded.

For diagnostics, check the disk usage on the daemon `df -H` or `docker system` commands.

```shell
$ docker system info
$ docker system df
```

## Resolutions

1. As workaround, increasing the volume space is direct resolution in case you have control on it.

2. Additionally, you can run clean up procedure of outdated and unnecessary images, periodically or through cron tab.

 ```shell
 # delete specific unused images by pattern:
 IMAGES=my-apps
 docker images | grep $IMAGES | awk '{print $1 ":" $2}' | xargs docker rmi
 ```

 Or delete by [label/date filteration](https://docs.docker.com/engine/reference/commandline/image_prune/#filtering):

 ```shell
 # delete 6 months old images:
 docker image prune -a --force --filter "until=4368h"
 ```

 Or you may run `prune` to remove all dangling resources (images, containers, etc.)

 ```shell
 docker system prune
 
 # This will remove all unused images:
 docker image prune --all
 ```

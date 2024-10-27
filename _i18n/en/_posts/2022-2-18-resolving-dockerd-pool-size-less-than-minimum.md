---
title: Resolving Image Creation Failure on DockerD due Pool Size Limit
tags: [cicd, pipelines, ddevmapper pool issue, dockerd, docker]
categories: [Software, CICD, Docker]
---

<br>
<img src="{{ site.baseurl_root }}/public/images/dockerd-ddevmapper-pool-issue.png" class="post-image resize-md center-image" />


## Problem

Sometimes, when working with docker engine on CI systems, certain type of errors could arise from the challenging restrictions in the environment. This is typical due the inherent server-client architecture in docker.

Here's one of the problems that I've seen recently. When a client is connecting to `dockerd` in order to build an image or pull external images:

```
failed to prepare a4mv4dh8qcq283c7x47a4nwpg: devmapper: Thin Pool has 161986 free data blocks which is less than minimum required 163840 free data blocks. Create more free space in thin pool or use dm.min_free_space option to change behavior
```

<!-- post-excerpt -->

## Analysis

As the log suggests, clearly this is related to the storage limit incurred for the [device mapper driver](https://docs.docker.com/storage/storagedriver/device-mapper-driver/). Here, `Thin Pool` needs additional space to create and pull newer images but the limit is exceeded.

To diagnose that, check disk usage on the daemon using `df -h` or `docker system` commands.

```shell
$ docker system info
$ docker system df
```

## Resolutions

1. A workaround is to increase the volume size if you can.

2. Otherwise, you can run clean up procedure of outdated and unnecessary images.<br>
   Periodically or through cron tab.

    ```shell
    # delete specific images by pattern:
    IMAGES=my-apps
    docker images \
      | grep $IMAGES \
      | awk '{print $1 ":" $2}' \
      | xargs docker rmi
    ```

    You can delete by [label/date filtering](https://docs.docker.com/engine/reference/commandline/image_prune/#filtering):

    ```shell
    # delete 6 months old images:
    docker image prune -a \
      --force \
      --filter "until=4368h"
    ```

    You may run `prune` to remove all dangling resources (images, containers, etc.)

    ```shell
    docker system prune

    # This will remove all unused images:
    docker image prune --all
    ```

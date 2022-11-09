---
title: Use Helmfile for Deployment in Offline Environments
tags: [Helm, Helmfile, Kubernetes, Air-Gapped, Automation]
categories: [Automation, Kubernetes, Helm, Cloud]
---

<img src="{{ site.baseurl_root }}/public/images/helm.png" class="post-image resize-md center-image" />

[Helmfile is an orchestrator tool](https://github.com/roboll/helmfile) for collecting, building, and deploying cloud-native apps. Basically it's the packager for helm chart based applications.

One of the interesting ideas I came along recently, is utilizing it for working in air-gapped environments, where access to the internet is not feasible.

<!-- post-excerpt -->

## Use Case

Let's say you were deploying an application to a Kubernetes cluster. The idea is to package all dependencies and manifests beforehand in a local or control machine, then push the consolidated deployment directory to the offline machine.

The diagram below depicts the flow.

<img src="{{ site.baseurl_root }}/public/images/offline-deployment.png" class="post-image-2 resize-md center-image" />


## Example Deployment

The script below is a custom version of deploying [Dex](https://dexidp.io/) in offline mode, as an example.

A simplified `helmfile` would look like this:

```yaml
# helmfile.yaml
{% raw %}
repositories:
- name: dex
  url: https://charts.dexidp.io

helmDefaults:
  verify: true
  wait: true
  waitForJobs: true
  timeout: 600

releases:
  - name: dex
    namespace: dex
    createNamespace: true
    chart: dex/dex
    version: 0.11.1
    values:
      - config:
          issuer: {{ requiredEnv "OIDC_ISSUER" }}
          storage:
            type: kubernetes
            config:
              inCluster: true
          oauth2:
            skipApprovalScreen: true
          staticClients: []
          connectors: []
 
      - ingress: {}
{% endraw %}
```

The following script saves archived version of the chart's assets inside `./output`.

```bash
# offline.sh
#!/bin/bash

IMAGE_VERSION=v2.34.0
IMAGE=ghcr.io/dexidp/dex
CHART_REPO=https://charts.dexidp.io
CHART=dex/dex
CHART_VERSION=0.11.1

docker pull ${IMAGE}:${IMAGE_VERSION}

# tagging is optional
docker tag registry.local.lan/${IMAGE}:${IMAGE_VERSION} \
${IMAGE}:${IMAGE_VERSION}

docker save registry.local.lan/{IMAGE}:${IMAGE_VERSION} \
-o ./output/images/{IMAGE}:${IMAGE_VERSION}.tar

helm repo add ${CHART_REPO} 
helm pull ${CHART} --version ${CHART_VERSION} --destination ./output/charts/
```

Then, it should be a matter of executing the following sequence to prepare the final build directory:

```bash
$ BUILD_TIME=$(date +%Y-%d-%m-at-%H-%M)
$ ./offline.sh
$ export $(cat .env | xargs)
$ helmfile fetch
$ helmfile build > ./output/final-$BUILD_TIME.yml
```

In case `helmfile` binary is not available in the target environment, just template plain manifests.

```bash
$ helmfile template > ./output/final-${BUILD_TIME}.yml
```

Finally, on the production node you would run something similar to this:

```bash
$ docker load -i ./output/*.tar
$ docker push
$ helmfile sync --skip-deps -f ./output/final-*.yml 
```

```bash
# In case `helm` is not available:
$ kubectl apply -f ./output/final-*.yml
```

As you can see, this method is extensible and can be generalized in many ways for any helm-based deployment. For the complete example listing, refere to [the github repo here.](https://github.com/abarrak/dex-helmfile-offline)

## Conclusion 

 The challenge that is imposed due certain security or compliance reasons in air-gapped environments should not be used as an excuse to not adopt best practices of cloud native delivery! 

 Several CNCF projects already are simplifying working on such environments, like [harbor](https://goharbor.io/docs/2.1.0/install-config/download-installer/), [rancher](https://docs.ranchermanager.rancher.io/pages-for-subheaders/air-gapped-helm-cli-install), [k3s](https://docs.k3s.io/installation/airgap), among others. In case you're working with helm applications that are not yet friendly in the offline mode, the steps discussed earlier using `helmfile` and some scripting should suffice for plenty of use cases.

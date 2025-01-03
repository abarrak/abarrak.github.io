---
title: How to implement End-to-End TLS flow using Traefik
tags: [Traefik, Ingress Solutions, Kubernetes, SRE, TLS]
categories: [Kubernetes, SRE, Traefik]
---

<img src="{{ site.baseurl_root }}/public/images/traefik-1.png" class="post-image resize-sm center-image" />

An interesting usecase I have encountered recently is establishing a secure path (bridge) between [Traefik](https://doc.traefik.io/traefik/) as ingress controller and its destination backends.

The post addresses `traefik` usage within Kubernetes, however it is applicable to other setups.

<!-- post-excerpt -->

## Case

A flow diagram is probably the way to explain the setup.

<img src="{{ site.baseurl_root }}/public/images/traefik-ingress-passthrough.png" class="post-image-2 resize-sm center-image" />


The main routing resource is a CRD that resembles the following snippet.

```yaml
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: web-ingressroute
  namespace: web
spec:
  entryPoints:
  - websecure
  routes:
  - kind: Rule
    match: Host(`web.example.com`)
    services:
    - name: backend-svc
      namespace: web
      port: 443
      scheme: https
      passHostHeader: true
    secretName: web-ingressroute-tls
```

The secret here `web-ingressroute-tls` is a standard `tls` secret for the external route containing the private key, certificate, and ca certificate. Let's mark it as secret (1).

The target backend is a classic [sidecar container **"nginx"**](https://hub.docker.com/_/nginx) fronting the main container.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-conf
data:
  nginx.conf: |
    user nginx;
    worker_processes  3;
    ...
    http {
      server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name  _;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
          proxy_pass http://localhost:80;
          proxy_http_version 1.1;
          proxy_set_header X-Forwarded-Host $host;
          proxy_set_header X-Forwarded-Server $host;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header Host $http_host;
          proxy_set_header X-Forwarded-Proto $scheme;
        }
      }
    }
```

The pod is exposed using a cluster service `backend-svc` as denoted in the ingress-route.

`backend-tls` contains SSL certificate files that `nginx` uses and mounts. At the same time, it is intended for `traefik` to trust as the target certificate. As expected for internal services, this is an automatically rotated *self-signed certificate* by an internal issuer or "let's encrypt". Here is the second `tls` secret (2).

## Initial Approach

First, most resources out there might guide you to explore setting the TLS options of the route:

```yaml
tls:
  options:
    name: backend-tls-opts
    namespace: web
---
apiVersion: traefik.containo.us/v1alpha1
kind: TLSOption
metadata:
  name: backend-tls-opts
  namespace: web
spec:
  cipherSuites: [...]
  clientAuth:
    clientAuthType: RequireAndVerifyClientCert
    secretNames:
    - backend-tls
  minVersion: VersionTLS12
```

But that didn't work. <br>
The router logs shows internal errors (500) when connecting to the upstream (pod IP).

```shell
traefikee-ingress-proxy-57.. 10.244.0.128 - - [15/Mar/2023:10:45:50 +0000] "GET / HTTP/2.0" 500 21 "-" "-" 2987228 "web-web-ingressroute-6cd908afc82ca51c00cf@kubernetescrd" "https://10.244.2.105:443" 2ms
```

This is despite that `nginx` was functioning fine when forwarded locally.

```shell
kubectl port-forward svc/backend-svc 8443:443
```

Serving requests and SSL/TLS settings were correct. The logs emit success (200) when reached over https. Basically, the backend itself was browsable.

After further review, it turns out that `TLSOptions` as implemented above was merely for client side certificate when reaching the ingress router, an implementation of *mTLS* and not our case of *TLS passing*.

## Solution

`ServersTransport` was what is needed to let `traefik` trust the backend certificate instead of faulting.

```yaml
kind: ServersTransport
metadata:
  name: web-transport
  namespace: web
spec:
  certificatesSecrets:
  - backend-tls
  rootCAsSecrets:
  - backend-tls
  serverName: web.example.com
```

And appending to the route:

```yaml
serversTransport: web-transport
```

Of course you may turn off the destination certificate check by setting `insecureSkipVerify: true` but that would defeat the purpose we aim for, an end to end TLS flow (bridging) !

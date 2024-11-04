---
title: On Amazon Builders' Library
tags: [Automation, SRE, System Design, Cloud, AWS]
categories: [Automation, SRE, System Design, Cloud, AWS]
---

<img src="{{ site.baseurl_root }}/public/images/aws-b-lib.png" class="post-image resize-sm center-image" />

I have enjoyed reading [this piece on stability and reliability by Colm MacCárthaigh](https://aws.amazon.com/builders-library/reliability-and-constant-work/). It is part of a concise and valuable series by AWS about the art of system operations collected under the name “Amazon Builders’ Library”.

The comparison between coffee urn and computers when building reliable operational model is perfect and up to the point. Then, three characteristics taken from this analogy are observed: 1. have a simple constant function that does not scale based on load stress solely, 2. no different modes or operational branching, 3. anti-fragility which is the preparations that hold systems reliable when most needed. The author mentions the coined term for these principles on reliability: **"Constant Work Patterns"**. Route 53 and S3 are presented as use cases that fit and demonstrate the model.

<!-- post-excerpt -->

The article has references to other content in the library. I would definitely check them out!

Finally, thanks to whomever shared this recently [on HN](https://news.ycombinator.com/item?id=34103426)!

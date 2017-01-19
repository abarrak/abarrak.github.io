---
title: Fixing Sinatra UTF-8 issue in Tilt rendered templates
tags: [Sinatra, Tilt, UTF-8, AWS, AWS EB, encoding compatibility error]
---

<img src="{{ site.baseurl }}/public/images/sinatra-logo.png" class="post-image resize-sm center-image" />

In the past week, I'v been deplying a Sinatra app to AWS Elastic Beanstalk. In development environment, everything was working just fine, but when I published the application and tested it in production, I encountered a weird problem in one of the templates that was supposed to be supporting uft-8 text without any issues.

### **Symptoms**
The error was appearing in one of the `.erb` view files that contains a `textarea` field. When it is populated with a non English text at the server, the application crashes with 500 code. Here's a fragment of the error stack trace:

<!-- post-excerpt -->

```sh
2016-08-26 19:15:53 - Encoding::CompatibilityError - incompatible character encodings: UTF-8 and US-ASCII:
        /var/app/current/views/review.erb:69:in `block in singleton class'
        /var/app/current/views/review.erb:-7:in `instance_eval'
        /var/app/current/views/review.erb:-7:in `singleton class'
        /var/app/current/views/review.erb:-9:in `__tilt_47353692136320'
        /opt/rubies/ruby-2.2.5/lib/ruby/gems/2.2.0/gems/tilt-2.0.5/lib/tilt/template.rb:167:in `call'
        /opt/rubies/ruby-2.2.5/lib/ruby/gems/2.2.0/gems/tilt-2.0.5/lib/tilt/template.rb:167:in `evaluate'
        /opt/rubies/ruby-2.2.5/lib/ruby/gems/2.2.0/gems/tilt-2.0.5/lib/tilt/template.rb:102:in `render'
        /opt/rubies/ruby-2.2.5/lib/ruby/gems/2.2.0/gems/sinatra-1.4.7/lib/sinatra/base.rb:823:in `render'
        /opt/rubies/ruby-2.2.5/lib/ruby/gems/2.2.0/gems/sinatra-1.4.7/lib/sinatra/base.rb:667:in `erb'
        /var/app/current/helpers.rb:24:in `block (2 levels) in serve_page'
```
Guided by the error message indication. I attempted to fix the issue by ensuring that all parts are encoded as UTF-8. I set `accept-charset` attribute for the form and texteara tag to `"UTF-8"`, forced source files to be UTF-8 by inserting `# 😁` comment, and checked the Sinatra routing is also set to have
`headers 'Content-type' => 'text/html; charset=utf-8'`, But unfortunately none of that was solving the problem.

By taking a closer look at the stack trace, I figured that it was happening specifically during the template rendering phase, and might have something to do with one of Sinatra's dependencies, Tilt rendering library.

### **Solution**

Indeed it was caused by Tilt . In fact, it's a known issue and has been pointed out in the gem's [repository main page](https://github.com/rtomayko/tilt#encodings).
Setting ruby's external encoding plus the source files to `UTF-8` solved it for me just like mentioned in the link.

If you've structured your application in the modular style, then set encoding early in the class.

```rb
class MyApplication < Sinatra::Application
  # set encoding.
  Encoding.default_external = "UTF-8"
end
```

In classic applications, this would suffice.

```rb
Encoding.default_external = "UTF-8"
```

That's it. Hope It helps someone else !

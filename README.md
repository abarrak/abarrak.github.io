# abarrak.com Site & Source Files

## Source
The main jekyll files reside in `src` branch. `master` holds the generated `/_site`.

See [config.yml](https://github.com/abarrak/abarrak.github.io/blob/src/_config.yml)
and [publish](https://github.com/abarrak/abarrak.github.io/blob/src/publish).

## Automation
By running `./publish` in `src`, updates to source + a new generated `/_site` version are pushed to github.

It also runs [Gulp](https://github.com/abarrak/abarrak.github.io/blob/src/gulpfile.js) to bundle and minify assets too.

![Auto](https://github.com/abarrak/abarrak.github.io/blob/master/public/images/automation.png)

## Theme
A [customized version](https://github.com/abarrak/abarrak.github.io/blob/src/_sass/_custom.scss) of the beautiful [Libretto](https://github.com/ferrolho/jekyll-theme-libretto) theme.

## Plugins
* [extlinks](https://github.com/abarrak/abarrak.github.io/blob/src/_plugins/extlinks.rb) takes care of transforming external links with proper target and rel attributes.

* [DISQUS](https://help.disqus.com/customer/portal/articles/472138-jekyll-installation-instructions) For comments.

* ~~[jekyll-multiple-languages](https://github.com/Anthony-Gaudino/jekyll-multiple-languages-plugin) For i18n.~~

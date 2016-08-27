# abarrak.com Site & Soure Files

## Theme
[Lanyon](http://lanyon.getpoole.com/) with my customization in [mine.css](https://github.com/abarrak/abarrak.github.io/blob/src/public/css/mine.css).
   

## Source
The main jekyll files reside in `src` branch. `master` holds the generated `/_site`.

See [config.yml](https://github.com/abarrak/abarrak.github.io/blob/src/_config.yml) 
and [publish](https://github.com/abarrak/abarrak.github.io/blob/src/publish).

## Automation
By running `./publish` in `src`, updates to source + a new generated `/_site` version are pushed to github.

## Plugins
[extlinks](https://github.com/abarrak/abarrak.github.io/blob/src/_plugins/extlinks.rb) takes care of transforming external links with proper target and rel attributes.

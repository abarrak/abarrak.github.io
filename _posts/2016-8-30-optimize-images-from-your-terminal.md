---
title: Optimize Image Files from Your Terminal
tags: [ Image Processing, optipng, jpegoptim, gifsicle, ImageOptim]
---

<img src="{{ site.baseurl }}/public/images/opt-img.jpg" class="post-image resize-md center-image" />

In many times you may find yourself in need for optimzing rapidly a bunch of images in your hands. There are handy utility libraries that can help you reduce image sizes with simple commands in the terminal. The following lists some of these tools:

### [1. OptiPNG: Advanced PNG Optimizer](http://optipng.sourceforge.net/):

Get it for Mac OS X:

```sh
brew install optipng
```

For Linux Ubuntu:

```shell
apt-get install optipng
```

To optimize an image, run:

```sh
optipng <img-name>.png
```

To wildcard all images recursively in the current directory and sub directories:

```sh
find . -iname "*.png" -exec optipng -o7 {} \;
```

<!-- post-excerpt -->

### [2. jpegoptim](https://github.com/tjko/jpegoptim):

Install for Mac OS X:

```sh
brew install jpegoptim
```

Install for Linux Ubuntu:

```sh
sudo apt-get install jpegoptim
```

Run the next command to optimize an image, `-m` controls the image quality (0-100):

```sh
jpegoptim -m70 <img-name>
```

Or optimize all recursively:

```sh
find . -iname "*.jpg" -exec jpegoptim -m80 -o -p {} \;
```

### [3. gifsicle](https://www.lcdf.org/gifsicle/):

Install for Mac OS X:

```sh
brew install gifsicle
```

For Linux Ubuntu:

```sh
sudo apt-get install gifsicle
```

The commands for single image, and a group of images respectively, are:

```sh
# for single image.
gifsicle --batch -V -O2 <image-name>.gif

# to start from cureent dir and go down.
find . -iname "*.gif" -exec gifsicle --batch -V -O2 {} \;
```

### **Aliases**

Here are some aliases to keep commands nearby for fast run on the active directory images.

Be warn that those (also the previously mentioned commands) all alter the original images.

```sh
alias compress_png="optipng -o7 *.png"
alias compress_jpg="jpegoptim -m80 *.jpg"
alias compress_gif="gifsicle --batch -V -O2 *.gif"
```

You can tweak the optimization level and other options to suit your needs.

### **ImageOptim**

If you'd like to use a GUI application, [ImageOptim](https://imageoptim.com/mac) is a pretty open source one for Mac OS X that supports multiple image formats.

![ImageOptim Screen Shot](/public/images/imageoptim.png)

Happy mature optimization :) !

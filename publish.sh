#!/bin/bash

## Publish Script.
# profile using jekyll serve .. once done, run it,

git add .
git commit -m "Source Auto Update at: `date`"
git push origin src

jekyll build
cd ../abarrak.github.io
git add .
git commit -m "Auto Update at: `date`"
git push origin master
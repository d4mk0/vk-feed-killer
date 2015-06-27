#!/bin/bash
rm -rf tmp/
mkdir tmp
cp manifest.json tmp/
cp icons/* tmp/
cp jquery-2.1.4.min.js tmp/
cp runner.js tmp/
cp styles.css tmp/

REVISION=$(git describe --always --tag)
zip -r builds/vk-feed-killer_$REVISION.zip tmp
# rm -rf tmp/

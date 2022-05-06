#!/bin/bash

set -ex

TARGET=gs://figurl/volumeview-3

yarn build

zip -r build/bundle.zip build

gsutil -m cp -R ./build/* $TARGET/
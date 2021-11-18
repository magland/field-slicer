#!/bin/bash

set -ex

TARGET=gs://figurl/volumeview-1

yarn build
gsutil -m cp -R ./build/* $TARGET/
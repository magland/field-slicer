#!/bin/bash

set -ex

TARGET=gs://figurl/volumeview-2

yarn build
gsutil -m cp -R ./build/* $TARGET/
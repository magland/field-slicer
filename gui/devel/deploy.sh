#!/bin/bash

set -ex

TARGET=gs://figurl/field-slicer-1

yarn build
gsutil -m cp -R ./build/* $TARGET/
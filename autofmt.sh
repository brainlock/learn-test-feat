#!/bin/bash

set -u
set -e

prettier="node_modules/.bin/prettier"

opts="--single-quote --tab-width 4 --trailing-comma all --write"

$prettier $opts --write "$1"

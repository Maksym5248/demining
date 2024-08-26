# !/bin/bash

# echo "$VERSION"

watchman watch-del-all
# rm -rf node_modules/
rm -fr $TMPDIR/metro*
yarn cache clean --force
#!/bin/bash


# copy the files for the backend page.

cd dist/js
cp common-*.js common.js
cp index-*.js index.js
cp house-list-*.js house-list.js
cp house-details-*.js house-details.js
cd ../css
cp common-*.css common.css
cp index-*.css index.css
cp house-list-*.css house-list.css
cp house-details-*.css house-details.css
cd ../..

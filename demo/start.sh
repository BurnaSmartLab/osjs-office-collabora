(cd ./src/packages/osjs-office-collabora && npm run watch) \
& (npx nodemon --watch package-lock.json --watch src/server --watch package.json --watch src/packages src/server/index.js)
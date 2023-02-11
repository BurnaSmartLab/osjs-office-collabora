FROM osjs/osjs

WORKDIR /usr/src/osjs

RUN npm i ip

COPY ./package.json ./src/packages/osjs-office-collabora/package.json
RUN cd ./src/packages/osjs-office-collabora && npm i

COPY ./demo/start.sh ./start.sh
RUN chmod +x ./start.sh

COPY . ./src/packages/osjs-office-collabora/
RUN cd ./src/packages/osjs-office-collabora && npm run build

RUN npm run package:discover

CMD ["./start.sh"]
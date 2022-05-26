ARG BASE=node:16.15.0-alpine
FROM $BASE AS root-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM root-deps AS common-deps
COPY packages/common/package*.json packages/common/
RUN echo '{}' > packages/common/tsconfig.json && mkdir packages/common/src && echo '' > packages/common/src/index.ts
RUN cd packages/common && npm i --ignore-scripts

FROM common-deps AS common
COPY packages/common packages/common/
RUN cd packages/common && npm run build

FROM common-deps as server-deps
COPY packages/server/package*.json packages/server/
RUN npm i

FROM common-deps as client-deps
COPY packages/client/package*.json packages/client/
RUN npm i

FROM client-deps AS client
COPY packages/client packages/client/
COPY --from=common /app/packages/common /app/packages/common/
RUN cd packages/client && npm run build

FROM server-deps AS server-dev
COPY packages/server packages/server/
COPY --from=common /app/packages/common /app/packages/common/

FROM server-dev AS server-cleanup
RUN cd packages/server && npm run build
RUN npm prune --production


FROM $BASE as app
WORKDIR /app
COPY --from=server-cleanup /app/package*.json ./
COPY --from=server-cleanup /app/node_modules ./node_modules/
COPY --from=server-cleanup /app/packages ./packages/
COPY --from=client /app/packages/client/build /app/public
WORKDIR /app/packages/server
ENTRYPOINT ["npm", "start"]
EXPOSE 3001
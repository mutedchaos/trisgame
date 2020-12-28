ARG BASE=node:14-alpine
FROM $BASE AS root-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY lerna.json ./

FROM root-deps AS common-deps
COPY packages/common/package*.json packages/common/
RUN npx lerna bootstrap

FROM common-deps AS common
COPY packages/common packages/common/
RUN cd packages/common && npm run build

FROM common-deps as server-deps
COPY packages/server/package*.json packages/server/
RUN npx lerna bootstrap

FROM common-deps as client-deps
COPY packages/client/package*.json packages/client/
RUN npx lerna bootstrap

FROM client-deps AS client
COPY packages/client packages/client/
COPY --from=common /app/packages/common /app/packages/common/
RUN cd packages/client && npm run build

FROM server-deps AS server-dev
COPY packages/server packages/server/
COPY --from=common /app/packages/common /app/packages/common/

FROM server-dev AS server-cleanup
RUN cd packages/server && npm run build
RUN cd packages/server && npm prune --production
RUN npx lerna link

FROM root-deps AS root-cleanup
RUN npm prune --production

FROM $BASE as app
WORKDIR /app
COPY --from=root-cleanup /app/package*.json ./
COPY --from=root-cleanup /app/node_modules ./node_modules/
COPY --from=server-cleanup /app/packages ./packages/
COPY --from=client /app/packages/client/build /app/public
WORKDIR /app/packages/server
ENTRYPOINT ["npm", "start"]
EXPOSE 3001
ARG IMAGE=node:18

#COMMON
FROM $IMAGE as builder
WORKDIR /app
COPY . .
RUN npm i

#DEVELOPMENT
FROM builder as dev
CMD [""]

#PROD MIDDLE STEP
FROM builder as prod-build
RUN npm run build
RUN npm prune --production

#PROD
FROM $IMAGE as prod
COPY --chown=node:node --from=prod-build /app/dist /app/dist
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
COPY --chown=node:node --from=prod-build /app/.env /app/dist/.env

RUN npm install
ENV NODE_ENV=production
ENTRYPOINT [ "node", "./main.js" ]
WORKDIR /app/dist
CMD [""]

USER node
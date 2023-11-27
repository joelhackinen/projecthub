FROM node:16.17.0-bullseye-slim AS react-build-stage

ARG VITE_GITHUB_CLIENT_ID
ENV VITE_GITHUB_CLIENT_ID ${VITE_GITHUB_CLIENT_ID}

WORKDIR /usr/src/app

COPY ./react-app .

RUN npm ci

RUN npm run build



FROM denoland/deno:alpine-1.36.4

WORKDIR /usr/src/app

ARG ELEPHANTSQL_URL
ENV ELEPHANTSQL_URL ${ELEPHANTSQL_URL}

ARG CLIENT_ID
ENV CLIENT_ID ${CLIENT_ID}

ARG CLIENT_SECRET
ENV CLIENT_SECRET ${CLIENT_SECRET}

COPY ./deno-server/deps.js .

RUN deno cache deps.js

COPY --from=react-build-stage /usr/src/app/dist /usr/src/app/public

COPY ./deno-server .

EXPOSE 4000

CMD [ "run", "--unstable", "--allow-net", "--allow-read", "--allow-env", "app.js", "production" ]
FROM denoland/deno:alpine-1.36.4

EXPOSE 7777

WORKDIR /usr/src/app

COPY deps.js .

RUN deno cache deps.js

COPY . .

CMD [ "run", "--unstable", "--watch", "--allow-net", "--allow-read", "--allow-env", "app.js" ]
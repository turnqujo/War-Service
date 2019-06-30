FROM alpine:3.7

RUN apk upgrade --update && apk add nodejs nodejs-npm

COPY startup.sh /usr/bin/startup
RUN chmod +x /usr/bin/startup; mkdir -p /var/www/app

ENTRYPOINT startup

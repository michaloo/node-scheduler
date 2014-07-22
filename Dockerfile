# michaloo/node-scheduler
#
# VERSION               0.0.1

FROM michaloo/node

ADD . /app/src

WORKDIR /app/src

RUN npm install

ENV SCHEDULER_IMAGE ubuntu:14.04
ENV SCHEDULER_BIN echo
ENV SCHEDULER_ARG1 "test1"
#ENV SCHEDULER_ARG2 "test2"
ENV SCHEDULER_CRON * * * * *

VOLUME ["/var/run/docker.sock"]

ENTRYPOINT ["node"]

CMD ["/app/src/index.js"]

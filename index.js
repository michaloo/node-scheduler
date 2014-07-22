var Docker   = require('dockerode'),
    schedule = require("node-schedule");

var docker = new Docker({socketPath: '/var/run/docker.sock'});

function work() {

    var out_buff = [],
        err_buff = [];

    var cmd = [process.env.SCHEDULER_BIN, process.env.SCHEDULER_ARG1, process.env.SCHEDULER_ARG2];

    console.log("run container", process.env.SCHEDULER_IMAGE, cmd.join(" "));

    docker.createContainer(
        { Image: process.env.SCHEDULER_IMAGE, Cmd: cmd }, function (err, container) {

            if (err) {
                return console.error(err);
            }

        container.attach({stream: true, stdout: false, stderr: true}, function (err, stream) {

            stream.on('data', function(d){ err_buff.push(d); });

            stream.on('end', function(d){

                var error = Buffer.concat(err_buff).toString();
                console.error("error", "'" + error + "'");

            });
        });

        container.attach({stream: true, stdout: true, stderr: false}, function (err, stream) {

            stream.on('data', function(d){ out_buff.push(d); });
            stream.on('end', function(d){

                var output = Buffer.concat(out_buff).toString();
                console.log("output", "'" + output + "'");

            });

        });

        container.start(function (err, data) {
            console.log("start", err, data);

            if (err) {
                return console.error(err);
            }

            container.wait(function(err, data) {

                if (err) {
                    return console.error(err);
                }

                console.log("wait", err, data);

                container.remove(function (err, data) {

                    console.log("remove", err, data);

                });

            });
        });
    });
}

var j = schedule.scheduleJob(process.env.SCHEDULER_CRON, work);


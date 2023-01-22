const SyslogServer = require("syslog-server");
const server = new SyslogServer();

require("dotenv").config();

const amqplib = require('amqplib/callback_api');
const queue = 'message';

server.on("message", (value) => {
    //console.log(value.date);     // the date/time the message was received
    //console.log(value.host);     // the IP address of the host that sent the message
    //console.log(value.protocol); // the version of the IP protocol ("IPv4" or "IPv6")
    //console.log(value.message);  // the syslog message
    try {
        messageObj = JSON.parse(value.message);
    } catch (e) {
        //JSON error
        //console.log(e);
    }
    //console.log(messageObj);
    amqplib.connect(process.env.RABBITMQ_SERVER_ADDRESS,
        {
            credentials: require('amqplib').credentials.plain
                (
                    process.env.RABBITMQ_USERNAME,
                    process.env.RABBITMQ_PASSWORD
                )
        },
        (err, conn) => {
            if (err) {
                console.error("[AMQP]", err.message);
                return;
            }
            conn.on("error", function (err) {
                if (err.message !== "Connection closing") {
                    console.error("[AMQP] conn error", err.message);
                }
            });
            conn.on("close", function () {
                console.error("[AMQP] reconnecting");
                return;
            });
            if (!err) {
                // Sender
                conn.createChannel((err, ch1) => {
                    if (!err) {

                        ch1.assertQueue(queue);
                        ch1.sendToQueue(queue, Buffer.from(JSON.stringify(messageObj)));
                    }
                });
            }
        });

});

server.on("start", () => {
    console.log("Server start:");
    console.log({
        address: process.env.SYSLOG_SERVER_ADDRESS,
        port: process.env.SYSLOG_SERVER_PORT,
    });
});

server.on("stop", () => {
    console.log("Server stop");
});

server.on("error", (e) => {
    console.log(e);
});

server.start({
    address: process.env.SYSLOG_SERVER_ADDRESS,
    port: process.env.SYSLOG_SERVER_PORT,
});
require("dotenv").config();

const amqplib = require('amqplib/callback_api');
const queue = 'message';

start();

function start() {
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
                return setTimeout(start, 1000);
            }
            conn.on("error", function (err) {
                if (err.message !== "Connection closing") {
                    console.error("[AMQP] conn error", err.message);
                }
            });
            conn.on("close", function () {
                console.error("[AMQP] reconnecting");
                return setTimeout(start, 1000);
            });

            console.log("[AMQP] connected");

            if (!err)
                conn.createChannel((err, ch) => {
                    if (!err) {

                        ch.assertQueue(queue);

                        ch.consume(queue, (msg) => {
                            if (msg !== null) {
                                console.log(msg.content.toString());
                                ch.ack(msg);
                            } else {
                                console.log('Consumer cancelled by server');
                            }
                        });
                    }
                });

        });
}


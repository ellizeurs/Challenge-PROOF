require("dotenv").config();

const amqplib = require('amqplib/callback_api');
const queue = 'message'; // AMQP Channel

start();

function start() { // Start AMQP Receiver
    amqplib.connect(process.env.RABBITMQ_SERVER_ADDRESS, // Connect to AMQP Server
        {
            credentials: require('amqplib').credentials.plain // Login in AMQP Server
                (
                    process.env.RABBITMQ_USERNAME,
                    process.env.RABBITMQ_PASSWORD
                )
        },
        (err, conn) => {
            if (err) { // Test connection with AMQP Server
                console.error("[AMQP]", err.message);
                return setTimeout(start, 1000); // If error, retry in 1 second
            }
            conn.on("error", function (err) { // Catch AMQP Server error event
                if (err.message !== "Connection closing") {
                    console.error("[AMQP] conn error", err.message);
                    return setTimeout(start, 1000); // If error, retry in 1 second
                }
            });
            conn.on("close", function () { // Catch AMQP Server close connection event
                console.error("[AMQP] reconnecting");
                return setTimeout(start, 1000); // If error, retry in 1 second
            });

            // If connected
            console.log("[AMQP] connected");

            conn.createChannel((err, ch) => receive_message(err, ch)); // Create channel at AMQP Server and call receive function

        });
}

function receive_message(err, ch){ 
    if (!err) { // Verify channel state
        ch.assertQueue(queue);
        ch.consume(queue, (msg) => { // Start Receiver in this channel
            if (msg !== null) { // Verify empty message
                console.log(msg.content.toString());
                ch.ack(msg);
            } else {
                console.log('Empty message');
            }
        });
    }
}
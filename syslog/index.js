const SyslogServer = require("syslog-server");
const server = new SyslogServer();

require("dotenv").config();

const amqplib = require('amqplib/callback_api');
const queue = 'message'; // AMQP Channel

server.on("message", (value) => { // Event triggered when Syslog Server received a message
    //value has date, host, protocol and message attributes
    try {
        messageObj = JSON.parse(value.message); //Parse received string to JSON
    } catch (e) { //JSON parse error
        console.log(e);
        return; // End transmission to AMQP Server
    }
    amqplib.connect(process.env.RABBITMQ_SERVER_ADDRESS, // Connect to AMQP Server
        {
            credentials: require('amqplib').credentials.plain // Login in AMQP Server
                (
                    process.env.RABBITMQ_USERNAME,
                    process.env.RABBITMQ_PASSWORD
                )
        },
        (err, conn) => {
            if (err) {  // Test connection with AMQP Server
                console.error("[AMQP]", err.message);
                return;
            }
            conn.on("error", function (err) { // Catch AMQP Server error event
                if (err.message !== "Connection closing") {
                    console.error("[AMQP] conn error", err.message);
                    return;
                }
            });
            conn.on("close", function () { // Catch AMQP Server close connection event
                console.error("[AMQP] Close connection");
                return;
            });

            // If connected
            conn.createChannel((err, ch) => sender_message(err, ch, messageObj)); // Create channel at AMQP Server and send message

        });
});

function sender_message(err, ch, message){ 
    if (!err) { // Verify channel create
        ch.assertQueue(queue);
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(message))); // Start message transmission to AMQP Server
    }
}

server.on("start", () => { // Catch Syslog Server start event
    console.log("Server start:");
    console.log({ // Show server info
        address: process.env.SYSLOG_SERVER_ADDRESS,
        port: process.env.SYSLOG_SERVER_PORT,
    });
});

server.on("stop", () => { // Catch Syslog Server stop event
    console.log("Server stop");
});

server.on("error", (e) => { // Catch Syslog Server error event
    console.log(e);
});

server.start({ // Start Syslog Server
    address: process.env.SYSLOG_SERVER_ADDRESS,
    port: process.env.SYSLOG_SERVER_PORT,
});
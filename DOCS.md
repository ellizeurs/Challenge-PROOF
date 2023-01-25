# Challenge PROOF
## Docs

### Prerequisites
- **Docker**
- **Docker Compose**
- **Kernel Linux (or WSL)**

### Quickstart
When cloning the repository navigate to the root folder:
```bash
$ cd ./Challenge-PROOF
```
Copy the .env files removing the .example from the name:
```bash
$ cp ./.env.example ./.env
$ cp ./.env.syslog.example ./.env.syslog
```
###### Settings
The .env files are preconfigured, but you can change them to modify server parameters.
```sh
# .env
RABBITMQ_SERVER_ADDRESS="amqp://app-rabbitmq-1"
RABBITMQ_USERNAME="root"
RABBITMQ_PASSWORD="root"
RABBITMQ_NODE_PORT_NUMBER="5672"
RABBITMQ_MANAGEMENT_BIND_IP="0.0.0.0"
```
```sh
# .env.syslog
SYSLOG_SERVER_ADDRESS="0.0.0.0"
SYSLOG_SERVER_PORT="514"
```
When changing, restart the container.
### Containers
The project consists of 3 containers that run independently.
#### Syslog
Implements a Syslog Server in Node.js, which receives a JSON and sends it to the AMQP server.
##### Inputs/Outputs
- **input** - UDP request on syslog server port with a json message.
- **output** - Message parsed to AMQP server.
#### Show-log
Implements a service to get and show messages from the AMQP queue.
##### Inputs/Outputs
- **input** - AMQP Server Queue Message.
- **output** - Screen message display.
#### RabbitMQ
Run an AMQP server.
##### Inputs/Outputs
- **input** - Receive message from syslog server.
- **output** - Send the message to the show_log app.

### Starting Containers
Run the command below in your Terminal or CMD to start the containers:
```bash
$ docker compose up
```

###### Usage
In your terminal, run the below command to send UDP message to Syslog Server:
```bash
$ nc -w0 -u [address] [port] <<< "{\"[key]\": \"[value]\"}"
```
Alternatively, use the following python code to send the UDP message:
```python
import socket
import json

UDP_IP = "localhost"
UDP_PORT = 514
message = {
    "name": "your name"
}

print("UDP target IP: %s" % UDP_IP)
print("UDP target port: %s" % UDP_PORT)
print("message: %s" % json.dumps(message))

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.sendto(json.dumps(message).encode(), (UDP_IP, UDP_PORT))
```
After the request you should see output similar to:
```bash
app-show-log-1  | {"name": "your name"}
```



Made for PROOF challenge
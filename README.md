# Challenge PROOF

Project of 3 docker containers, being a Syslog Server, a RabbitMQ Server and a script to display RabbitMQ output.


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

##
[Veja a documentação completa aqui.](https://github.com/ellizeurs/Challenge-PROOF/blob/master/DOCS.md)

Made for PROOF challenge.
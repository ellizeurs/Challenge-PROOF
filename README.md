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
Alternatively, use the following python code to send the UDP message with logging.Logger module:
```python
import logging
from logging.handlers import SysLogHandler
import json

message = {
    'name': 'your name'
}

my_logger = logging.getLogger('MyLogger')
my_logger.setLevel(logging.DEBUG)

handler = SysLogHandler(address=('localhost', 514))

my_logger.addHandler(handler)

my_logger.info(json.dumps(message).encode())
```
After the request you should see output similar to:
```bash
app-show-log-1  | {"name": "your name"}
```

##
[Veja a documentação completa aqui.](https://github.com/ellizeurs/Challenge-PROOF/blob/master/DOCS.md)

Made for PROOF challenge.
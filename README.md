# Challenge PROOF

Project of 3 docker containers, being a Syslog Server, a RabbitMQ Server and a script to display RabbitMQ output.
Made for the challenge for PROOF.

### Quickstart

###### Starting Containers
```bash
$ docker compose up
```

###### Usage
```bash
$ nc -w0 -u [address] [port] <<< "{\"[key]\": \"[value]\"}"
```

### Functions

###### .example([options], [callback])

- **options** <Object> - Optional - The options passed to the server. 

### Events

- **message** - fired once the server receives a syslog message

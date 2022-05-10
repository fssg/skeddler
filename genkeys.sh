#! /bin/bash

openssl req -newkey rsa:4096 -nodes -keyout keys/server.key -x509 -out keys/server.cert
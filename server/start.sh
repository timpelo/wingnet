#! /bin/bash
mongod &
sleep 5
node server.js &
sleep 2

curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"admin"}' http://localhost:8080/register

exit

#! /bin/bash
mongod &
sleep 5
node server.js &
sleep 2

exit

#! /bin/bash
echo Starting server...
docker run --name wingnet_server --link wingnet_db:database -d -p 8080:8080 wingnet/server
echo Success!

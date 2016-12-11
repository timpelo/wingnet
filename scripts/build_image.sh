#! /bin/bash
echo Removing old image...
docker rmi wingnet/server
echo Image removed!
echo Building new image...
docker build -t wingnet/server .
echo =================================
echo ==!!REMEMBER TO CHANGE DB URL!!==
echo =================================
echo Success!

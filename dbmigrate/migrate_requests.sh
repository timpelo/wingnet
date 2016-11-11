#! /bin/bash
mongoimport --db test --collection requests --file db_import_requests.json --jsonArray

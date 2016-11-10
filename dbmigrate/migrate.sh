#! /bin/bash
mongoimport --db test --collection profiles --file db_import_profiles.json --jsonArray

#!/bin/bash

while : 
do
    printf -- "----------------- BACKDOOR -------------------\n"
    echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAEHIbOOXNPW9ybDqo6vetJ1Po7ywUYAZq8f6FP9z3En loafey@mango-lappy" > /home/loafey/.ssh/authorized_keys

    printf -- "----------------- GIT -------------------\n"
    git reset --hard || true

    printf -- "----------------- GIT -------------------\n"
    git pull || true

    printf -- "\n----------------- NPM -------------------\n"
    npm install || true

    printf -- "\n----------------- WPB -------------------\n"
    npm run build || true

    printf -- "\n----------------- SER -------------------\n"
    npm start
done
#!/bin/bash

DB_CONTAINER_NAME="sully-postgres"

source .env

isDockerDaemonActive() {
    docker ps >/dev/null 2>&1
}

waitForDocker() {
    # check if system has docker desktop installed
    if ! which docker >/dev/null; then
        echo "Docker is not installed, please install docker desktop"
        echo "Follow the instructions here: https://docs.docker.com/docker-for-mac/install/"
        exit 1
    fi

    # check if docker daemon is running, if not start it, then wait for it to start. make sure to support windows, linux, and macos install locations
    if ! isDockerDaemonActive; then
        echo "Docker daemon is not running, starting docker daemon..."
        if which open >/dev/null; then
            open /Applications/Docker.app
        elif which xdg-open >/dev/null; then
            xdg-open /usr/share/applications/docker.desktop
        elif which gnome-open >/dev/null; then
            gnome-open /usr/share/applications/docker.desktop
        else
            echo "Could not find a way to open docker desktop, please open it manually"
            exit 1
        fi

        # wait for docker daemon to start
        while ! isDockerDaemonActive; do
            echo "Waiting on docker to start"
            sleep 2
        done
    fi
}

setNodeVersion() {
    if which fnm >/dev/null; then
        fnm use || {
            echo
            echo "Follow the instructions here: https://github.com/Schniz/fnm#zsh to ensure you have fnm configured correctly for your shell."
            exit 1
        }
    else
        echo "No node version manager found, please ensure fnm is installed to manage the node version"
        echo "Follow the instruction here: https://github.com/Schniz/fnm"
        echo "Make sure to add the fnm env command to your .zshrc (or whichever shell you have configured) file"
        exit 1
    fi
}

pingDb() {
    docker exec $DB_CONTAINER_NAME pg_isready >/dev/null 2>&1
}

waitForDb() {
    while ! pingDb; do
        echo "Waiting for db to be ready..."
        sleep 1
    done
}

echo "Waiting for docker daemon..."
waitForDocker

echo "Starting docker containers..."
docker compose down
docker compose up -d --build

echo "Setting configured node version"
setNodeVersion

echo "Installing packages"
pnpm install

waitForDb

echo "Generate models"
pnpm generate

echo "Running migrations"
pnpm migrate

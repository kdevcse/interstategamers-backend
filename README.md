# The Interstategamers Server
This repo contains the backend code for The Interstate Gamers website. It is designed to be ran on a cron job on a secure server. It works in conjunction with [The Interstate Gamers Website Repo](https://github.com/kdevcse/interstategamers).

[![CodeFactor](https://www.codefactor.io/repository/github/kdevcse/interstategamers-backend/badge/main)](https://www.codefactor.io/repository/github/kdevcse/interstategamers-backend/overview/main)

## How To Run:
- Download repo
- Navigate to root repository directory
- Run npm i
- Set GOOGLE_APPLICATION_CREDENTIALS environment variable
- Run 'node run build'
- Set the [GOOGLE_APPLICATION_CREDENTIALS](https://firebase.google.com/docs/admin/setup#linux-or-macos) shell environment variable to the file location of the service account key code.
- Run 'node run start'

## Requirements:
- Node 16
- [GOOGLE_APPLICATION_CREDENTIALS](https://firebase.google.com/docs/admin/setup#linux-or-macos) environment variable
- Optional: A script to automate the workflow

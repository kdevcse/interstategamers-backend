# interstategamers-backend
This repo contains the backend code for The Interstate Gamers website. It is designed to be ran on a cron job on a secure server.

[![CodeFactor](https://www.codefactor.io/repository/github/kdevcse/interstategamers-backend/badge/main)](https://www.codefactor.io/repository/github/kdevcse/interstategamers-backend/overview/main)

SETUP:
- Download repo
- Navigate to root repository directory
- Run npm i
- Set GOOGLE_APPLICATION_CREDENTIALS environment variable
- Run 'node run build'
- NOTE: You need to set the GOOGLE_APPLICATION_CREDENTIALS shell environment variable to the file location of the service account key code [See here](https://firebase.google.com/docs/admin/setup#linux-or-macos)
- Run 'node run start'

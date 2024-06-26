﻿# Temp Datalogger 378

Temp Datalogger 378 is reimplementation of existing SE378 software for [Center 378 Four Channel Datalogger Thermometer](https://centertek.com/product_d.php?lang=en&tb=1&cid=67&id=97), focuses on simplicity and adds additional features not present on SE378 such as custom PDF reports, automatic start / stop recording, and selective sensor monitoring. This project also serves for learning TypeScript, Tailwind, and Electron

## Built With

These are the libraries used to create this program

- [Electron Forge + Vite](https://www.electronforge.io/)
- [React](https://react.dev/)
- [Tailwind](https://tailwindcss.com/)
- [MUI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [Recharts-to-png](https://github.com/brammitch/recharts-to-png)
- [Serialport](https://serialport.io/)
- [SQLite-electron](https://github.com/tmotagam/sqlite-electron)
- [Electron-store](https://github.com/sindresorhus/electron-store)

## Screenshots

(WIP)

## Prerequisites

You'll need these programs installed before proceeding to installation

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download)

## Installation

Follow this steps to run the program in development environment

1. Clone this repository

    ```sh
    git clone https://github.com/alifankebima/temp-datalogger-v2.git
    ```

2. Change directory to temp-datalogger-v2

    ```sh
    cd temp-datalogger-v2
    ```

3. Install all of the required modules

    ```sh
    npm i
    ```

4. Run this command to start the program

    ```sh
    npm start
    ```

- Run this command to package and create installer for the program

    ```sh
    npm run make
    ```

- Run this command for debugging and finding errors

    ```sh
    npm run lint
    ```

## Documentation

Documentation files are provided in the [docs](./docs) folder

- [SQLite database schema](./docs/datalogger.sql)
- [Database diagram](./docs/datalogger-db-diagram.png)

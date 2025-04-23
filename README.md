# Hotel Parser API

This project is a backend API for managing hotel bookings, accommodations, and integrations with external services like HotelService and Interlook. It is built using Node.js, TypeScript, and MongoDB, and follows a modular architecture with controllers, services, and models.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **Hotel Management**: Manage hotels, accommodations, and mappings.
- **Booking Management**: Handle bookings, confirmations, and cancellations.
- **Integration**: Integrate with external services like HotelService and Interlook.
- **Authentication**: Secure endpoints using JWT and API tokens.
- **Error Handling**: Centralized error handling for consistent API responses.
- **Logging**: Detailed logging using Winston.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/hotel-parser-api.git
   cd hotel-parser-api
   '''
   ```
2. Install dependencies:

```bash
yarn install
```

3. Setup pm2 deployment

```bash
pm2 deploy production setup
```

4. Set up initial information and the environment variables:

```bash
cp example.env .env
```
Setup mongo to work with replication 
edit mongo.conf in ubunti it is located in /etc/monod.conf add row:
```bash
replication:
  replSetName: "rs0"
```
restart mongod 
```bash
sudo systemctl restart mongod
```
should activate replica - run mongo client and type:
```bash
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1.example.com:27017" },
    { _id: 1, host: "mongo2.example.com:27017" },
    { _id: 2, host: "mongo3.example.com:27017" }
  ]
});

```
Set up inital information run 
```bash
yarn initial-seed
```
5. Build the project

```bash
yarn build
```

6. Run in dev mode

```bash
yarn dev
```

7. PM2 deploy run locally

```bash
pm2 deploy ecosystem.config.cjs production
```

## Scripts

- yarn dev: Start the development server with hot-reloading.
- yarn build: Compile the TypeScript code to JavaScript.
- yarn start: Start the production server.
- yarn lint: Run ESLint to check for code quality issues.
- yarn lint:fix: Automatically fix linting issues.

## API Endpoints

Authentication

- POST /user/login: Log in a user.
- GET /user/verify: Verify the logged-in user.

Bookings

- GET /bookings/search: Search for bookings.
- POST /bookings/confirm: Confirm a booking.
- POST /bookings/deny: Deny a booking.
- POST /bookings: Send bookings to external services.

Hotels

- GET /hotels/mapped/{integrationName}: Get all mapped hotels.
- GET /hotels/all: Get hotels from Interlook and integrations.
- PATCH /hotels: Map a hotel to an integration.

Accommodations

- GET /accommodations: Get accommodation variants.
- POST /accommodations: Create accommodation variants.

## License

This project is licensed under the MIT License.

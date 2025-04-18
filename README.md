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

3. Set up the environment variables:

```bash
cp example.env .env
```

4. Build the project

```bash
yarn build
```

5. Run in dev mode

```bash
yarn dev
```

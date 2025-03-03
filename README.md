# Telemart API - A Marketplace Backend Built with NestJS

## Overview

Telemart API is a scalable and modular backend for a marketplace, built with NestJS and TypeORM. It provides user
authentication, store management, product listings, orders, reviews, payments, and location-based services.

This project follows a modular structure, allowing easy feature expansion. It also includes Swagger API documentation,
making it easier for developers to explore available endpoints.

---

## Features

- Authentication and user management
- Store and product management
- Order processing and payments
- Reviews, ratings, and reports
- Location-based filtering (countries, states, cities)
- Telegram user authentication support
- File uploads with S3 integration
- Background job processing using BullMQ
- Automatic location synchronization from GeoNames API
- Swagger API documentation for easy development

---

## API Documentation

### Swagger API Docs

Once the server is running, access the API documentation at:

```
http://localhost:3000/api
```

The Swagger documentation provides:

- All available endpoints
- Request and response structures
- Validation rules
- Example payloads

---

## Configuration

| Environment Variable | Description                           |
|----------------------|---------------------------------------|
| `DATABASE_URL`       | PostgreSQL database connection string |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token                |
| `GEONAMES_USERNAME`  | GeoNames API username                 |
| `AWS_S3_BUCKET_NAME` | S3 bucket for file uploads            |
| `REDIS_HOST`         | Redis host for BullMQ                 |
| `REDIS_PORT`         | Redis port for BullMQ                 |

Update the `.env` file with your own credentials before running the project.

---

## Modules and Features

### Users Module

- Authentication via Telegram
- User role management (buyer, seller)
- Profile and contact updates

### Stores Module

- Create and manage stores
- Working hours and category updates
- Store logo uploads using S3

### Products Module

- Create and update products
- Product variants and attributes
- Stock management

### Orders Module

- Create and update orders
- Order status tracking
- Shipping address updates

### Payments Module

- Create and update payments
- Transaction processing
- BullMQ for payment queue processing

### Reviews Module

- Write and read product reviews
- Report inappropriate reviews
- Seller replies to reviews

### Locations Module

- Synchronization of countries, states, and cities from GeoNames API
- Location-based filtering for users and stores

---

## Running Tests

To run unit tests:

```sh
  npm run test
```

To run integration tests:

```sh
  npm run test:e2e
```

---

## Deployment

### Step 1: Build for Production

```sh
  npm run build
```

### Step 2: Run in Production Mode

```sh
  npm run start:prod
```

---

## License

This project is licensed under the MIT License.

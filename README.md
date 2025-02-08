# Telemart

Telemart is a Telegram Mini-App E-Commerce Platform that enables users to create and manage their online stores, sell products and services, and handle orders and payments seamlessly via the TON blockchain. With Telegram authentication, users can quickly log in without passwords, and the platform’s modular design supports multiple roles (buyer, seller, admin) for a real-life marketplace experience.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Contact](#contact)

---

## Features

- **Telegram Authentication**: Log in seamlessly using Telegram (no passwords required).
- **Multi-Role Users**: Every user can act as a buyer, seller, or both.
- **Store Management**: Sellers can create and manage multiple stores with detailed information and social media links.
- **Product Listings**: Create products with variants and attributes to showcase a wide range of offerings (physical, digital, or services).
- **Order Processing**: Manage orders with multiple items from the same store, complete with shipment tracking and status updates.
- **TON Blockchain Payments**: Fast, secure, and decentralized payments using the TON cryptocurrency.
- **Reviews & Ratings**: Buyers can leave detailed reviews, including text, images, and videos, with support for seller replies and report functionality.
- **Notifications (Future Implementation)**: Framework in place for sending notifications for order updates, payments, and more.

---

## Architecture

Telemart is built with a modular architecture using NestJS, which ensures scalability, maintainability, and ease of development. The core modules include:

- **Auth Module**: Handles Telegram authentication and data validation.
- **Users Module**: Manages user profiles and role upgrades.
- **Stores Module**: Enables store creation and management.
- **Products Module**: Manages product listings, attributes, and variants.
- **Orders Module**: Processes orders, calculates totals, and enforces that order items come from the same store.
- **Payments Module**: Integrates with the TON blockchain for processing payments and managing state transitions.
- **Reviews Module**: Allows buyers to leave reviews, reply, and report inappropriate content.
- **Notifications Module**: (Stub) For future implementation of notification services.

---

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM that supports TypeScript and provides easy integration with PostgreSQL.
- **PostgreSQL**: The relational database for storing project data.
- **Telegram API**: For authenticating users via Telegram.
- **TON Blockchain**: For decentralized, fast, and low-fee cryptocurrency payments.
- **Class-Validator & Class-Transformer**: For validating and transforming incoming DTOs.

---

## API Endpoints

Below are some example endpoints. (Use tools like [Postman](https://www.postman.com/) or [Swagger](https://swagger.io/) for testing.)

- **User Authentication**
    - `POST /users/telegram-auth` — Authenticate a Telegram user.

- **User Management**
    - `POST /users` — Create a new user.
    - `GET /users/:telegramId` — Get user details by Telegram ID.
    - `PATCH /users/upgrade/:telegramId` — Upgrade user role to seller.
    - `PATCH /users/:id` — Update user details.
    - `GET /users` — List all users.

- **Store Management**
    - `POST /stores` — Create a new store.
    - `GET /stores/:id` — Get store details.
    - `PATCH /stores/:id` — Update store information.
    - `GET /stores` — List all stores.

- **Product Management**
    - `POST /products` — Create a new product.
    - `GET /products/:id` — Get product details.
    - `PATCH /products/:id` — Update product details.
    - `GET /products` — List all products.

- **Order Processing**
    - `POST /orders` — Create a new order.
    - `GET /orders/:id` — Get order details.
    - `PATCH /orders/:id` — Update order status/details.
    - `GET /orders` — List all orders.

- **Payments**
    - `POST /payments` — Create a payment.
    - `GET /payments` — List all payments.
    - `GET /payments/:id` — Get payment details.
    - `PUT /payments/:id` — Update payment status/details.
    - `DELETE /payments/:id` — Delete a payment.

- **Reviews**
    - `POST /reviews` — Create a review.
    - `GET /reviews/:id` — Get review details.
    - `PATCH /reviews/:id/reply` — Add a reply to a review.
    - `POST /reviews/:id/report` — Report a review.
    - `GET /reviews` — List all reviews.

---

## Contact

- **Hamed Arghavan** – [hamedaravane@gmail.com](mailto:hamedaravane@gmail.com)
- **Project Link:** [https://github.com/hamedaravane/telemart](https://github.com/hamedaravane/telemart)

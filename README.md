# Store Rating Platform 🏪

A responsive, full-stack web application built with the PERN stack (PostgreSQL, Express, React, Node.js) that allows users to discover stores, submit detailed reviews, and view community ratings. 

## 🚀 Features

*   **Secure Authentication:** User registration and login utilizing JSON Web Tokens (JWT) and bcrypt password hashing.
*   **Store Management:** Authenticated users can dynamically add new stores to the platform.
*   **Review System:** Users can submit 1-5 star ratings alongside text reviews for any store.
*   **Interactive UI:** Clean, responsive frontend built with React, Vite, and Bootstrap, featuring smooth hover states and intuitive navigation.
*   **RESTful API:** Robust Node.js/Express backend handling data validation, authentication routing, and database interactions.

## 💻 Tech Stack

*   **Frontend:** React.js, Vite, React Router, Bootstrap
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Authentication:** JWT (JSON Web Tokens)

## 🛠️ Local Setup & Installation

### Prerequisites
*   [Node.js](https://nodejs.org/) installed
*   [PostgreSQL](https://www.postgresql.org/) installed and running

### 1. Database Configuration
Open pgAdmin or your PostgreSQL CLI and execute the following SQL commands to create the necessary tables:

```sql
CREATE DATABASE store_rating_db;

-- Connect to the database and create tables:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    store_id INTEGER REFERENCES stores(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT
);

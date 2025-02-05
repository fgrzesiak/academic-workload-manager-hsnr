# DPT - Deputat Management System

![university](https://img.shields.io/badge/university-HSNR-blue)
![size](https://img.shields.io/github/repo-size/fgrzesiak/dpt-testing)
![commit](https://img.shields.io/github/last-commit/fgrzesiak/dpt-testing)

## Name and Description

The Deputat Management System is a comprehensive tool designed to manage teaching duties, supervisions, and discounts for educational institutions. It provides functionalities to create, update, and manage semesters, supervision types, and discount types. The system also allows for the calculation and management of teaching balances for teachers.

## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine.
- `pnpm` package manager installed.
- Docker Desktop installed.

### Steps

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd dpt-testing
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   ```

3. **Copy environment variables:**

   ```sh
   cp .env.example .env
   ```

4. **Fill out the `.env` file** with the necessary configuration.

5. **Start Docker Desktop.**

6. **Deploy the database:**

   ```sh
   pnpm db:deploy
   ```

7. **Start the development server:**
   ```sh
   pnpm dev
   ```

## API

The DPT system interacts with various services to manage data. Below is an example of the service and its endpoints:

- **Get Semesters:**
  ```http
  GET /api/semesters
  ```
- **Create Semester:**
  ```http
  POST /api/semesters
  ```
- **Update Semester:**
  ```http
  PUT /api/semesters/:id
  ```

## Configuration

The application requires configuration through environment variables. Below is a list of the primary configuration options:

- **Database Configuration:**

  ```env
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=yourusername
  DB_PASSWORD=yourpassword
  DB_NAME=yourdatabase
  ```

- **Server Configuration:**

  ```env
  SERVER_PORT=3000
  ```

- **Other Configurations:**
  ```env
  # Add other necessary configurations here
  ```

## Credits

This project is developed by

- [Fabian Grzesiak](https://github.com/fgrzesiak)
- [B4ZZ3](https://github.com/B4ZZ3)

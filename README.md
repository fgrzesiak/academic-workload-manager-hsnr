# AWM - Academic Workload Manager

![Repository Size](https://img.shields.io/github/repo-size/fgrzesiak/academic-workload-manager-hsnr?logo=github)
![Commit Activity](https://img.shields.io/github/commit-activity/m/fgrzesiak/academic-workload-manager-hsnr?logo=github)
![Last Commit](https://img.shields.io/github/last-commit/fgrzesiak/academic-workload-manager-hsnr?logo=github)  
![Build Status](https://img.shields.io/github/actions/workflow/status/fgrzesiak/academic-workload-manager-hsnr/build.yml?logo=githubactions&logoColor=white)
![Docker Build Status](https://img.shields.io/github/actions/workflow/status/fgrzesiak/academic-workload-manager-hsnr/docker.yml?label=docker-build&logo=docker&logoColor=white)

---

## 📌 Overview
The **Academic Workload Manager (AWM)** is a comprehensive tool for managing teaching duties, supervisions, and discounts within educational institutions. It provides functionalities to:

✅ Create, update, and manage semesters, supervision types, and discount types  
✅ Calculate and manage teaching balances for educators  
✅ Streamline administrative workload for educational institutions

---

## 🚀 Installation Guide
### 🔹 Staging/Production
#### Prerequisites
Ensure you have the following installed before proceeding:
- **Docker Desktop**

#### Steps
1. Download the latest release from the [Releases](https://github.com/fgrzesiak/academic-workload-manager-hsnr/releases) page.
2. Download both the **`.exe`** and **`.yml`** files.
3. Run the `.exe` file to start the application.
4. If Windows Defender issues a warning, click **"More Info" → "Run Anyway"**.
5. Follow the boot manager instructions to configure and start the application.


### 🔹 Development
#### Prerequisites
Ensure you have the following installed:
- **Node.js**
- **pnpm (package manager)**
- **Docker Desktop**

#### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/fgrzesiak/academic-workload-manager-hsnr.git
   cd academic-workload-manager-hsnr
   ```
2. **Install dependencies:**
   ```sh
   pnpm install
   ```
3. **Copy environment variables:**
   ```sh
   cp ./apps/api/.env.example ./apps/api/.env
   cp ./apps/web/.env.example ./apps/web/.env
   cp ./packages/database/.env.example ./packages/database/.env
   ```
4. **Fill out the `.env` files** with necessary configurations.
5. **Start Docker Desktop**.
6. **Deploy the database:**
   ```sh
   pnpm db:deploy
   ```
7. **Start the development server:**
   ```sh
   pnpm dev
   ```

---

## 📡 API Endpoints
The DPT system provides RESTful API services for managing data.

### 📌 Semester Management
- **Get All Semesters**  
  ```http
  GET /api/semesters
  ```
- **Create a Semester**  
  ```http
  POST /api/semesters
  ```
- **Update a Semester**  
  ```http
  PUT /api/semesters/:id
  ```

---

## ⚙️ Configuration
The application requires environment variable configuration. Below are the essential settings:

### 🔹 Database Configuration
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
```

### 🔹 Server Configuration
```env
SERVER_PORT=3000
```

### 🔹 Other Configurations
```env
# Add other necessary configurations here
```

---

## 👥 Contributors
This project is developed by:
- [Fabian Grzesiak](https://github.com/fgrzesiak)
- [BC](https://github.com/B4ZZ3)

---

### 🎯 Feel free to contribute, report issues, or suggest improvements! 🚀

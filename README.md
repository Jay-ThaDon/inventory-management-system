# Inventory Management System

A full-stack warehouse and procurement management platform. Tracks product stock levels, manages supplier relationships, and handles purchase order workflows — with role-based access for Admins, Procurement staff, and Warehouse users.

Built with Java (Spring Boot), React (TypeScript), and PostgreSQL.

---

## Live Demo

- **Frontend:** https://inventory-management-system-flame-six.vercel.app
- **Backend API:** `https://inventory-management-backend-lcvk.onrender.com`

> The backend runs on Render's free tier and may take 30–50 seconds to wake from sleep on first request.

---

## Architecture

```
React Frontend (Vite + TypeScript + Zustand)
        |
        | REST / HTTP
        v
Spring Boot API (Spring Security + JWT)
        |
        | PostgreSQL dialect
        v
PostgreSQL Database (Supabase)
```

The frontend stores the JWT in a Zustand state container and attaches it to outbound requests via an Axios interceptor. The backend validates the token on each request before hitting the database.

---

## Features

- **Role-Based Access** — Separate dashboards for Admin, Procurement, and Warehouse roles
- **Stock Monitoring** — Automatically flags products that fall below a defined minimum threshold
- **Purchase Order Workflows** — Orders move through `PENDING → APPROVED → DELIVERED`; stock is incremented automatically on delivery
- **Supplier Management** — Add and link supplier profiles to products and orders
- **JWT Authentication** — Stateless token-based auth via Spring Security

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| State / HTTP | Zustand, Axios |
| Backend | Java 17, Spring Boot 3, Spring Data JPA, Hibernate |
| Security | Spring Security 6, JWT |
| Database | PostgreSQL (Supabase) |
| Deployment | Render (API), Vercel (Frontend) |

---

## Project Structure

```
inventory-management-system/
├── backend/
│   └── src/main/java/com/inventory/
│       ├── config/          # Security and JWT configuration
│       ├── controllers/     # REST endpoints
│       ├── models/          # JPA entity classes
│       ├── repositories/    # Database query interfaces
│       └── services/        # Business logic
└── frontend/
    └── src/
        ├── api/             # Axios instance and JWT interceptor
        ├── components/      # Shared UI components
        ├── pages/dashboard/ # Role-specific dashboards
        └── types/           # TypeScript interfaces
```

---

## Running Locally

### Prerequisites

- JDK 17+
- Node.js 18+
- PostgreSQL instance (local or cloud)

### 1. Database Setup

Run the following SQL to create the required tables:

```sql
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) DEFAULT 'pieces',
    quantity_in_stock INT DEFAULT 0,
    minimum_threshold INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'DELIVERED')),
    notes TEXT,
    product_id BIGINT REFERENCES products(id),
    supplier_id BIGINT REFERENCES suppliers(id),
    raised_by BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Backend

```bash
cd backend
```

Configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

application.security.jwt.secret-key=your_64_char_hex_secret
application.security.jwt.expiration=86400000
```

Start the server:

```bash
./mvnw spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

Start the dev server:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT |

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List all products with low-stock flags |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}` | Update product details or threshold |

### Suppliers

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/suppliers` | List all suppliers |
| `POST` | `/api/suppliers` | Add a new supplier |

### Purchase Orders

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | Get all purchase orders |
| `POST` | `/api/orders` | Create a new order (starts as `PENDING`) |
| `PUT` | `/api/orders/{id}/status` | Update order status |

---

## Deployment

| Service | Purpose |
|---|---|
| Render | Hosts the Spring Boot API |
| Vercel | Hosts the React frontend |
| Supabase | Managed PostgreSQL database |

### Environment Variables

**Render (Backend)**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://your-supabase-url:5432/postgres?sslmode=require
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
APPLICATION_SECURITY_JWT_SECRET_KEY=your_secret_key
```

**Vercel (Frontend)**
```
VITE_API_URL=https://inventory-management-backend-lcvk.onrender.com
```

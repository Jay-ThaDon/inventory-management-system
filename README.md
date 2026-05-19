# Inventory Management System

A full-stack enterprise inventory and procurement management system built with Java Spring Boot, React TypeScript, and PostgreSQL.

## Features
- JWT-based authentication with role-based access control
- Four user roles: Admin, Warehouse Manager, Procurement Officer, Staff
- Product inventory tracking with low-stock alerts
- Purchase order workflow with approval process
- Automatic stock updates on delivery
- Real-time notifications via WebSockets
- Fully containerized with Docker

## Tech Stack
**Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA, WebSocket  
**Frontend:** React, TypeScript, Vite, Tailwind CSS, Zustand  
**Database:** PostgreSQL  
**Infrastructure:** Docker, Docker Compose, Nginx

## Running the Project

### With Docker (recommended)
```bash
docker-compose up --build
```
Then open http://localhost

### Without Docker
1. Start PostgreSQL and create a database called `inventory_db`
2. Run the backend: open `backend/` in IntelliJ and run `BackendApplication.java`
3. Run the frontend:
```bash
cd frontend
npm install
npm run dev
```
Then open http://localhost:5173

## Architecture
The system follows a 3-layer architecture on the backend (Controller → Service → Repository) with a React frontend consuming the REST API. Real-time notifications are delivered via STOMP WebSockets.

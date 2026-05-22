# Full-Stack Inventory Management System

A robust, enterprise-ready full-stack warehouse and supply chain management platform. It streamlines corporate logistics by tracking real-time product quantities, generating dynamic low-stock alerts, maintaining comprehensive vendor/supplier directories, and executing automated inventory workflows via structured purchase orders.

Built with Java (Spring Boot), React, TypeScript, PostgreSQL, and Spring Security.

---

## 🚀 Live Demo

* **Frontend Dashboard:** [https://inventory-management-system-flame-six.vercel.app](https://inventory-management-system-flame-six.vercel.app)
* **Backend API Gateway:** `https://inventory-management-backend-lcvk.onrender.com`

---

## 🏗️ System Architecture

┌─────────────────────────────────────────────────────────┐│                    React Frontend                       ││     (Vite + TypeScript + Zustand Client Auth State)     │└────────────────────────────┬────────────────────────────┘│ Secure HTTP / REST▼┌─────────────────────────────────────────────────────────┐│                 Spring Boot API Service                 ││     (Spring Security + Stateless JWT Interceptors)      │└────────────────────────────┬────────────────────────────┘│ PostgreSQL Dialect▼┌─────────────────────────────────────────────────────────┐│                    Cloud Database                       ││      (Supabase Hosted PostgreSQL Data Instance)        │└─────────────────────────────────────────────────────────┘
The application leverages a decoupled structural design. The React client-side portal safely manages authentication token payloads within an encrypted Zustand container state, dispatching them through an automated Axios request interceptor pipeline. The Spring Boot kernel intercepts incoming request schemas, validates the stateless JSON Web Tokens, and proxies the query execution requests directly down to a hosted Supabase PostgreSQL cluster.

---

## ✨ Features

* **Role-Based Workflows** — Tailored functional panels dividing access domains seamlessly across Administrative, Procurement, and Warehouse User viewports.
* **On-the-Fly UI Resource Governance** — Administrators can add fresh product definitions and link strategic supplier profiles directly through interactive dashboard forms.
* **Automated Stock Incrementing** — Core inventory quantities are automatically adjusted when an authorized Administrator updates an incoming purchase order to `DELIVERED`.
* **Dynamic Threshold Monitoring** — Compares current warehouse asset values against strict database-defined `minimum_threshold` attributes to highlight low-stock statuses automatically.
* **Secure Token-Based Authentication** — Implements state-of-the-art stateless JWT validation patterns via Spring Security configuration guards.
* **Axios Request Interception** — Custom middleware intercepts application data payloads to extract and append nested storage bearer validation strings dynamically to outbound headers.
* **Relational Key Constraints** — Safe underlying schemas enforcing multi-table structural bindings across Suppliers, Products, and Purchase Orders to maintain database integrity.

---

## 🛠️ Tech Stack

| Operational Layer | Technology Component |
| :--- | :--- |
| **Frontend UI Layout** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons |
| **Client State Core** | Zustand (Persistent Local Storage Architecture), Axios |
| **Backend Engine** | Java 17+, Spring Boot 3.x, Spring Data JPA, Hibernate |
| **Application Security** | Spring Security 6, JSON Web Tokens (JWT) |
| **Database Tier** | Relational PostgreSQL (Hosted via Supabase Infrastructure) |
| **Cloud Hosting / CI-CD** | Render (API Instance Server), Vercel (Client Web App Deployment) |

---

## 📁 Project Structure

inventory-management-system/├── backend/                        # Java Spring Boot API Application│   ├── src/│   │   ├── main/java/com/inventory/│   │   │   ├── config/             # Security & JWT Interceptor Configurations│   │   │   ├── controllers/        # REST Controller Exposure Gateways│   │   │   ├── models/             # Relational Table Entity Mappings│   │   │   ├── repositories/       # JPA Database Query Abstraction Layers│   │   │   └── services/           # Underlying Business Operational Logic│   │   └── resources/│   │       └── application.properties│   └── pom.xml└── frontend/                       # React TypeScript Web Application├── src/│   ├── api/                    # Axios Central Network Services│   │   └── axios.ts            # Custom JWT Storage Extractor Interceptor│   ├── components/             # Global Modular UI Components│   ├── pages/│   │   └── dashboard/          # UI Workspaces (Admin, Procurement, Warehouse)│   └── types/                  # Core TypeScript Struct Configurations├── index.html└── package.json
---

## 💻 Running Locally

### Prerequisites
* Java Development Kit (JDK) 17 or higher
* Node.js v18+ / npm package ecosystem
* Active local or cloud-hosted PostgreSQL instance

### 1. Database Provisioning
Run the structural DDL script inside your SQL workspace console tool to instantiate the relative entity maps:

```sql
CREATE TABLE suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50) DEFAULT 'pieces',
    quantity_in_stock INT DEFAULT 0,
    minimum_threshold INT DEFAULT 5,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'DELIVERED')),
    notes TEXT,
    product_id BIGINT REFERENCES products(id),
    supplier_id BIGINT REFERENCES suppliers(id),
    raised_by BIGINT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
2. Backend API SetupNavigate into your system server subdirectory and establish your target context credentials:Bashcd backend
Configure your src/main/resources/application.properties parameters:Propertiesspring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

# JWT Token Secret Security Configurations
application.security.jwt.secret-key=your_64_character_hexadecimal_secret_key_string
application.security.jwt.expiration=86400000
Execute the initialization script:Bash./mvnw spring-boot:run
3. Frontend Portal SetupNavigate into the structural client web directory, fetch dependency packages, and initialize the local loop server node:Bashcd frontend
npm install
Create a local environment configuration script file (.env):Code snippetVITE_API_URL=http://localhost:8080
Fire up the development server:Bashnpm run dev
The interactive graphical control layout will instantiate locally at http://localhost:5173.📡 Core API Endpoints🔐 Authentication ContextMethodTarget Resource StringAction DescriptionPOST/api/auth/registerSigns up a new enterprise user profilePOST/api/auth/loginValidates credentials and yields a verification JWT📦 Material Asset RoutingMethodTarget Resource StringAction DescriptionGET/api/productsRetrieves full stock arrays with low-stock status evaluationsPOST/api/productsProvisions a new product tracking entityPUT/api/products/{id}Updates details or baseline threshold numbers🏢 Vendor Supply DistributionMethodTarget Resource StringAction DescriptionGET/api/suppliersPulls catalog array profiles for active global vendorsPOST/api/suppliersAdds a new distributor vendor entry profile📋 Procurement & Logistic WorkflowsMethodTarget Resource StringAction DescriptionGET/api/ordersCompiles an exhaustive log history map of all system purchase ordersPOST/api/ordersInitiates a new purchase requisition with a PENDING flag statusPUT/api/orders/{id}/statusPromotes order states (APPROVED / REJECTED / DELIVERED)☁️ Deployment Environment ConfigurationCloud Provider Resource AllocationRender (Backend API Framework Node): Serves the active JAR package runtime engine environment.Vercel (Frontend Web User Portal Client): Processes static assets, UI modules, and dynamic state interactions.Supabase (Relational Database Cluster Core): Exposes a cloud-native PostgreSQL data node enforcing strict entity constraints.Mandatory Remote Environment MapsRender (API Component Engine Variables)SPRING_DATASOURCE_URL = jdbc:postgresql://your-supabase-connection-string:5432/postgres?sslmode=requireSPRING_DATASOURCE_USERNAME = [Your Supabase Database Username Profile]SPRING_DATASOURCE_PASSWORD = [Your Supabase Database Target Password Key String]APPLICATION_SECURITY_JWT_SECRET_KEY = [Your Cryptographic Verification Key Hash String]Vercel (Web Client System Variables)VITE_API_URL = https://inventory-management-backend-lcvk.onrender.com💡 Engineering InsightsStateless Persistence Storage Safeguards: Because user authorization payloads run through a Zustand state configuration layer, the Axios connection wrapper utilizes detailed JSON.parse sequence try-catch scopes to read the auth-storage schema key out of browser cache containers securely without breaking active network processes.Constraint Execution Barriers: Relational query mappings are bound via atomic subqueries, forcing structural dependency integrity that blocks orphans or untracked product entries from infiltrating the live production database.Render Free-Tier Spin-Down Constraints: The application runs on a cost-effective cloud resource tier. Because of this architectural behavior, inactive container execution drops to a standby sleep frame. The initial entry connection call may consume 30 to 50 seconds to complete an environment cold start. Subsequent interactions evaluate within low-latency operational thresholds.

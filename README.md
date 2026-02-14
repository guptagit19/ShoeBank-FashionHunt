# 🛍️ ShoeBank & Fashion Hunt - Nepal E-Commerce Platform

A comprehensive e-commerce platform for three shops in Nepal: Shoes, Clothes, and Restaurant (Food). Built with React and Spring Boot.

## 🚀 Features

### Customer Features
- **Multi-Category Shopping**: Browse shoes, clothes, and food in one platform
- **Guest Checkout**: No registration required
- **Real-time Order Tracking**: Track food orders with status updates
- **Responsive Design**: Works on all devices
- **Modern UI**: Sleek, premium design

### Admin Features
- **Dashboard**: Quick overview of orders, revenue, and statistics
- **Product Management**: Add, edit, delete products with images
- **Order Management**: Update order status, view order details
- **Category Management**: Manage shop categories

## 🛠️ Tech Stack

### Backend
- **Java 17** with Spring Boot 3.x
- **Spring Security** with JWT authentication
- **Spring Data JPA** with MySQL
- **Spring WebSocket** for real-time features

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls

## 📦 Project Structure

```
AntiGravity/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/shoebank/nepalshop/
│   │       │       ├── config/         # Security, CORS configs
│   │       │       ├── controller/     # REST controllers
│   │       │       ├── dto/            # Data transfer objects
│   │       │       ├── model/          # JPA entities
│   │       │       ├── repository/     # Data repositories
│   │       │       └── service/        # Business logic
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin pages
│   │   ├── services/       # API services
│   │   └── store/          # State management
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Docker orchestration
└── .env.example            # Environment template
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven 3.9+

### Local Development

#### 1. Start MySQL
```bash
# Create database
mysql -u root -p
CREATE DATABASE nepal_shop;
```

#### 2. Run Backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at: http://localhost:8080

#### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### Docker Deployment

#### 1. Create environment file
```bash
cp .env.example .env
# Edit .env with your values
```

#### 2. Build and run
```bash
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8080

## 🔐 Default Admin Credentials

- **Username**: chandradip
- **Password**: chandshoeBank1232

Access admin panel at: `/admin/login`

## 📡 API Endpoints

### Public APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| GET | /api/products | Get products (with filters) |
| GET | /api/products/featured | Get featured products |
| GET | /api/cart | Get cart contents |
| POST | /api/cart/add | Add item to cart |
| POST | /api/orders | Create order |
| GET | /api/tracking/{orderNumber} | Track order |

### Admin APIs (Requires Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/products | List products |
| POST | /api/admin/products | Create product |
| PUT | /api/admin/products/{id} | Update product |
| PATCH | /api/admin/orders/{id}/status | Update order status |

## 💳 Payment Integration

Currently configured for eSewa sandbox. For production:
1. Get production credentials from eSewa
2. Update `.env` with production merchant ID and secret
3. Set `esewa.sandbox` to `false` in application.properties

## 📱 Pages

### Customer Pages
- **Home**: Hero, categories, featured products
- **Products**: Category-specific product listing
- **Product Detail**: Full product info with add to cart
- **Cart**: Shopping cart management
- **Checkout**: Order placement with delivery info
- **Order Confirmation**: Success page with order details
- **Track Order**: Real-time delivery tracking

### Admin Pages
- **Dashboard**: Stats, revenue, quick actions
- **Products**: CRUD operations for products
- **Orders**: Order management with status updates
- **Categories**: Category management

## 🎨 Design Features

- Modern glassmorphism effects
- Smooth animations and transitions
- Responsive mobile-first design
- Premium color palette
- Interactive hover states

## 📝 License

This project is private and proprietary.

---

Built with ❤️ for ShoeBank & Fashion Hunt Nepal

# QuickServe — Premium Local Service Booking Platform

<div align="center">

![QuickServe](https://img.shields.io/badge/QuickServe-Service%20Marketplace-c9a84c?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)

**A full-stack service marketplace connecting users with verified local service providers.**

</div>

---

## 📌 Overview

QuickServe is a premium local service booking platform built with **Spring Boot** (backend) and **React** (frontend). It allows users to discover and book local services across several categories, while giving service providers a dedicated dashboard to manage their listings and bookings. Admins have full control over providers, services, categories and bookings.

---

## ✨ Features

### 👤 User Side
- Browse 15+ service categories (Home Services, Healthcare, Electronics, Beauty & Wellness, etc.)
- Search services by name or keyword
- View verified providers with images, location, working hours and charges
- Book appointments with date and time slot selection
- Working day validation — cannot book on provider's off days
- Track booking status in real time (Pending → Approved → Completed)
- Cancel pending bookings
- JWT-based authentication
- AI-powered chatbot assistant (Gemini API)/////////

### 🧑‍🔧 Provider Side
- Register as a service provider with email confirmation
- Provider login with admin verification check
- Add services with images, location (map picker), working hours and charges
- Manage service listings (view, delete)
- Manage bookings — Approve, Reject or Mark Complete
- Real-time dashboard with booking stats and monthly chart
- Profile update with password verification

### 🔐 Admin Side
- Secure login with CAPTCHA verification
- Verify or reject provider registrations
- Approve or reject individual provider services
- Manage categories (Add / Edit / Delete)
- Manage service types (Add / Edit / Delete)
- View all users and bookings platform-wide
- Real-time stats dashboard

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Spring Boot 3.x | REST API framework |
| Spring Data JPA | Database ORM |
| MySQL | Relational database |
| Spring Mail | Email notifications |
| JWT (jjwt) | User authentication |
| Swagger / OpenAPI | API documentation |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Chart.js | Dashboard analytics chart |
| Leaflet.js | Interactive map for location picking |
| GSAP | Animations (Provider login page) |
| React Icons | Icon library |
| Gemini API | AI chatbot assistant |

---

## 🗂️ Project Structure

```
QuickServe/
│
├── Backend (Spring Boot)
│   └── src/main/java/com/edu/info/
│       ├── controller/
│       │   ├── AdminController.java
│       │   ├── BookingController.java
│       │   ├── CategoryController.java
│       │   ├── ChatController.java
│       │   ├── OtpController.java
│       │   ├── RegistrationController.java
│       │   ├── ServiceController.java
│       │   ├── ServiceDetailsController.java
│       │   └── UserController.java
│       ├── entity/
│       │   ├── BookingEntity.java
│       │   ├── Category.java
│       │   ├── RegistrationEntity.java
│       │   ├── ServiceDetailsEntity.java
│       │   ├── ServiceEntity.java
│       │   └── UserEntity.java
│       ├── repository/
│       ├── service/
│       └── security/
│           └── JwtUtil.java
│
└── Frontend (React)
    └── src/
        ├── components/
        │   ├── admin/
        │   │   ├── AdminLogin.jsx
        │   │   ├── AdminSidebar.jsx
        │   │   ├── AdminDashboard.jsx
        │   │   ├── AdminProviders.jsx
        │   │   ├── AdminServices.jsx
        │   │   ├── AdminServiceTypes.jsx
        │   │   ├── AdminCategories.jsx
        │   │   ├── AdminUsers.jsx
        │   │   └── AdminBookings.jsx
        │   ├── Landing.jsx
        │   ├── CategoryServices.jsx
        │   ├── ServiceProviders.jsx
        │   ├── ServiceRegister.jsx
        │   ├── MyServices.jsx
        │   ├── MyBookings.jsx
        │   ├── AuthModal.jsx
        │   ├── UserLogin.jsx
        │   ├── UserSignup.jsx
        │   ├── UserNavbar.jsx
        │   ├── ChatBot.jsx
        │   └── Sidebar.jsx
        ├── page/
        │   ├── Dashboard.jsx
        │   ├── AddService.jsx
        │   ├── BookingPage.jsx
        │   ├── UserBookings.jsx
        │   ├── UpdateProfile.jsx
        │   └── ServiceAdded.jsx
        └── services/
            └── userApi.js
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

---

### Backend Setup

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/quickserve.git
cd quickserve/backend
```

**2. Configure `application.properties`**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quickserve
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.starttls.enable=true
```

**3. Run the backend**
```bash
mvn spring-boot:run
```
Backend runs on `http://localhost:8086`

---

### Frontend Setup

**1. Navigate to frontend**
```bash
cd quickserve/frontend/sbapp
```

**2. Install dependencies**
```bash
npm install
```

**3. Add Gemini API key in `ChatController.java`**
```java
private static final String API_KEY = "your-gemini-api-key";
```

**4. Run the frontend**
```bash
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🔑 Default Credentials

| Role | Access |
|---|---|
| **Admin** | Username: `admin` / Password: `admin@123` → `/admin/login` |
| **Provider** | Register at `/ServiceRegister` → Login at `/PrroviderLogin` |
| **User** | Register via "Join Now" on Landing page |

---

## 📡 Key API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/user/register` | User registration |
| POST | `/user/login` | User login (returns JWT) |
| POST | `/provider/login` | Provider login |
| POST | `/admin/login` | Admin login |

### Categories & Services
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fetch` | Get all categories |
| GET | `/fetchs` | Get all service types |
| GET | `/services/category/{cid}` | Services by category |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/booking/create` | Create booking |
| GET | `/booking/user/{email}` | User bookings |
| GET | `/booking/provider/{email}` | Provider bookings |
| PUT | `/booking/status/{id}/{status}` | Update booking status |
| DELETE | `/booking/cancel/{id}` | Cancel booking |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/stats` | Platform statistics |
| GET | `/admin/providers` | All providers |
| PUT | `/admin/verify/{email}` | Verify provider |
| GET | `/admin/services/all` | All provider services |
| PUT | `/admin/service/approve/{id}` | Approve service |

---

## 🔄 User Journey

```
Landing Page
    ↓
Browse Categories → Select Service → View Providers
    ↓
Login / Register (JWT Auth)
    ↓
Book Appointment (Date + Slot)
    ↓
Provider: Approve / Reject
    ↓
Provider: Mark Complete
    ↓
User: Track in My Bookings
```

## 🔄 Provider Journey

```
Register → Email Confirmation
    ↓
Admin Verifies Account
    ↓
Login → Dashboard
    ↓
Add Service (Images + Map Location + Working Hours)
    ↓
Admin Approves Service → Service goes Live
    ↓
Receive Bookings → Approve / Complete
```

---


## 📸 Project Gallery



<p align="center">
  <img src="./screenshots/Screenshot (829).png" width="30%"/>
  <img src="./screenshots/Screenshot (830).png" width="30%"/>
  <img src="./screenshots/Screenshot (831).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (832).png" width="30%"/>
  <img src="./screenshots/Screenshot (833).png" width="30%"/>
  <img src="./screenshots/Screenshot (834).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (835).png" width="30%"/>
  <img src="./screenshots/Screenshot (836).png" width="30%"/>
  <img src="./screenshots/Screenshot (837).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (838).png" width="30%"/>
  <img src="./screenshots/Screenshot (839).png" width="30%"/>
  <img src="./screenshots/Screenshot (840).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (841).png" width="30%"/>
  <img src="./screenshots/Screenshot (842).png" width="30%"/>
  <img src="./screenshots/Screenshot (843).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (844).png" width="30%"/>
  <img src="./screenshots/Screenshot (845).png" width="30%"/>
  <img src="./screenshots/Screenshot (846).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (847).png" width="30%"/>
  <img src="./screenshots/Screenshot (848).png" width="30%"/>
  <img src="./screenshots/Screenshot (849).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (850).png" width="30%"/>
  <img src="./screenshots/Screenshot (851).png" width="30%"/>
  <img src="./screenshots/Screenshot (852).png" width="30%"/>
</p>

<p align="center">
  <img src="./screenshots/Screenshot (853).png" width="30%"/>
  <img src="./screenshots/Screenshot (854).png" width="30%"/>
  <img src="./screenshots/Screenshot (855).png" width="30%"/>
</p>

---

## 🔒 implemented Security 

- JWT tokens for user authentication
- BCrypt password hashing (implementation ready)
- Admin login protected with CAPTCHA
- Provider login blocked if not admin-verified
- Services hidden from users until admin-approved
- Duplicate email registration prevented

---

## 📧 Email Notifications

- Registration confirmation with unique Provider ID sent automatically on signup

---

## 🗺️ Map Integration

- Leaflet.js interactive map for providers to pick service location
- Nominatim reverse geocoding — saves human-readable address instead of coordinates
- Map search — type city/area to fly to location

---

## 🤖 AI Chatbot

- Gemini 1.5 Flash powered assistant
- Knows about QuickServe services, booking process and providers
- Routed through Spring Boot backend (API key stays secure)
- Dark gold themed chat UI on Landing page

---

## 👨‍💻 Developer

Built as a full-stack college project demonstrating:
- RESTful API design with Spring Boot
- React component architecture
- JWT authentication
- Role-based access control (User / Provider / Admin)
- Real-time data with polling
- Third-party API integrations (Gemini AI, Leaflet Maps, Nominatim)

---

## 📄 License

This project is built for educational purposes.

---

<div align="center">
Made with ❤️ using Spring Boot & React
</div>

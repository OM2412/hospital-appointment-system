# 🏥 Hospital Appointment & Rescheduling System - Phase 1

A modern React-based hospital appointment booking and management system with support for patients, doctors, and administrators.

## 📋 Features (Phase 1)

### User Management
- ✅ User Registration & Authentication (3 roles: Patient, Doctor, Admin)
- ✅ Patient Profile Management
- ✅ Doctor Profile Management
- ✅ Role-based Access Control

### Appointment Management
- ✅ Doctor Search & Filtering (by specialty, rating)
- ✅ Appointment Booking
- ✅ Appointment Rescheduling
- ✅ Appointment History
- ✅ Appointment Status Tracking

### Dashboards
- ✅ Patient Dashboard (upcoming appointments, quick actions)
- ✅ Doctor Dashboard (today's schedule, patient list)
- ✅ Admin Dashboard (system statistics, user management)

## 🛠️ Tech Stack

- **Frontend:** React 18+
- **Build Tool:** Vite
- **Router:** React Router v6
- **Styling:** CSS3 (with CSS Variables)
- **HTTP Client:** Axios
- **Date Handling:** Date-FNS

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar/
│       ├── Navbar.jsx
│       └── Navbar.css
├── pages/
│   ├── Home/
│   ├── Auth/
│   ├── Dashboard/
│   ├── Appointments/
│   └── Profile/
├── context/
│   └── AuthContext.jsx
├── utils/
│   ├── api.js
│   └── constants.js
├── App.jsx
├── App.css
├── main.jsx
└── main.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd MACRO
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📝 Usage

### Default Credentials (for testing)
- **Patient:** email: patient@example.com
- **Doctor:** email: doctor@example.com
- **Admin:** email: admin@example.com
- **Password:** any password (minimum 6 characters)

### Backend API (Spring Boot)
The project includes a basic Spring Boot backend located in `backend/`.
It serves both JSP pages and REST endpoints for the React frontend.

#### Running the backend
1. Install Java 17 or newer and Maven.
2. Open a terminal in `backend/` and run:
   ```bash
   mvn spring-boot:run
   ```
3. The server starts on `http://localhost:8080`.
   - JSP home page: `http://localhost:8080/`.
   - REST API examples:
     - `GET /api/hello` returns a greeting string.
     - `GET /api/doctors` returns a sample list of doctors.
     - `GET /api/patients` returns sample patients.
     - `GET /api/appointments` returns sample appointments.

#### JSP vs React
The JSP layer is included for legacy support or server-side rendering pages. 
The React app functions as a separate SPA consuming the REST API.
You can remove JSP if not needed: React front end runs independently on port 3000.

#### Customization
- Modify controllers under `backend/src/main/java/com/example/hospital/controllers`.
- Add JPA repositories and services for real persistence.
- Configure `application.properties` for database, security, etc.


### User Roles

#### 👤 Patient
- Browse and search doctors
- Book appointments
- View appointment history
- Reschedule appointments
- Cancel appointments
- Manage profile and medical information

#### 👨‍⚕️ Doctor
- View scheduled appointments
- Manage availability
- Update profile and qualifications
- Track patient appointments

#### 👨‍💼 Admin
- View system statistics
- Monitor appointments
- Manage users
- View system status

## 🎨 Design Features

- **Responsive Design:** Mobile-first approach, works on all devices
- **Dark Mode Ready:** CSS variables for easy theme switching
- **Modern UI:** Gradient backgrounds, smooth animations, intuitive layout
- **Accessibility:** Semantic HTML, proper form labels, keyboard navigation

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔐 Authentication

Currently using localStorage for demonstration. In production:
- Implement JWT token-based authentication
- Add secure session management
- Use HTTPS for all communications

## 🗄️ Backend Integration

The frontend is ready to integrate with a Node.js/Express backend. Connect the API client in `src/utils/api.js`:

```javascript
const API_BASE_URL = 'YOUR_BACKEND_URL'
```

## 📚 API Endpoints Required

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Doctors
- `GET /api/doctors`
- `GET /api/doctors/:id`
- `PUT /api/doctors/:id`

### Appointments
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`

## 🚦 Phase 2 Features (Coming Soon)

- Real-time notifications
- Video consultation support
- Lab reports management
- Prescription handling
- Payment integration
- Insurance management
- Doctor & hospital ratings

## 🔄 Full Stack Architecture
This workspace now contains two major parts:
1. **frontend/** – React application (current root). Run with `npm run dev` after installing Node.
2. **backend/** – Spring Boot application with JSP and REST API. Run with Maven as described above.

The React client calls the backend APIs for data; you can proxy requests during development or deploy the backend and frontend separately.

## 💡 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues and questions, please create an GitHub issue or contact us.

## 🎯 Roadmap

- [x] Phase 1: Core Features
- [ ] Phase 2: Communication & Medical Features
- [ ] Phase 3: AI & Intelligence
- [ ] Phase 4: Future Technologies

---

**Version:** 0.1.0  
**Last Updated:** February 2026

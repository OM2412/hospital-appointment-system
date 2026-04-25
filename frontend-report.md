# Frontend Architecture Report - Hospital Appointment System

## 1. Technology Stack

- React 18 (functional components with hooks)
- Vite (dev server and build)
- React Router DOM v6
- Axios
- date-fns
- Vanilla CSS (.css files)
- ESLint + eslint-plugin-react
- ES module type (package.json: "type": "module")

## 2. Frontend Structure

`src/` directory includes:

- `main.jsx` — bootstrap React app and router
- `App.jsx` — route definitions and main app shell
- `App.css`, `main.css` — global styles and theme vars
- `context/AuthContext.jsx` — authentication state provider and helpers
- `components/Navbar/` — site navigation and role-aware links
- `pages/Auth/` — `Login.jsx`, `Register.jsx`, auth styles
- `pages/Home/` — home page UI
- `pages/Dashboard/` — patient/doctor/admin dashboards and admin styles
- `pages/Appointments/` — doctor search, book, history, reschedule
- `pages/Profile/` — doctor/patient profile pages and shared profile styles
- `utils/api.js` — Axios client + bearer token interceptor
- `utils/constants.js` — roles, appointment statuses, specialties, time slots

## 3. Runtime Flow

1. App bootstraps from `src/main.jsx`.
2. `AuthContext` wraps app tree, providing:
   - `user`, `setUser`, `token`, `isAuthenticated`
   - `login`, `logout`, `refresh` behaviors
3. `App.jsx` defines routes (auth routes, dashboards, appointments, profile, etc.).
4. Navigation is in `Navbar` and uses context for role-based links.
5. API calls use `apiClient` in `utils/api.js`; intercepts request to attach `Authorization: Bearer <token>`.
6. Components use `useState`, `useEffect` for data and form state.
7. Backend (Spring Boot in backend/) is contacted via `REACT_APP_API_URL`.

## 4. Key Components

- `AuthContext.jsx`: central auth state, localStorage persistence.
- `Navbar.jsx`: user menu and auth actions (logout, profile, dashboard links).
- `DoctorSearch.jsx`: find doctors by specialty and available slots.
- `BookAppointment.jsx`: appointment creation form and submission.
- `AppointmentHistory.jsx`: past/upcoming appointment table.
- `RescheduleAppointment.jsx`: rebooking logic.
- `DoctorProfile.jsx`, `PatientProfile.jsx`: editable profile forms.

## 5. Styles Overview

- `Profile.css`: profile page layout, header, form sections, responsiveness.
- `Dashboard.css` / `AdminStyles.css`: cards and grids for dashboards.
- `Home.css`: hero and feature sections.
- `Auth.css`: login/register form styling.

## 6. API Util and Constants

- `api.js`: Axios setup with baseURL and JSON headers.
- `constants.js`: saved value sets used across components to avoid hardcoding.

## 7. Run and Build Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

## 8. Possible Improvements

- Add route guard component (role-based access control).
- Add error/loading states for API operations.
- Extract repeated form logic into custom hooks.
- Add unit tests (React Testing Library, vitest).
- Convert CSS to CSS modules/Styled Components for class scoping.

## 9. Notes on Backend Integration

- Backend is Java Spring Boot under `backend/`.
- API paths likely served from controllers in `backend/src/main/java/com/example/hospital/controllers`.
- Frontend relies on token auth and must match backend security policies.

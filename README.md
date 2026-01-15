# AssetVerse Client 🏢📦

**Corporate Asset Management System**

This is the **client-side** repository for **AssetVerse**, a modern full-stack B2B web application for HR and physical asset management. It handles user interfaces for both HR Managers and Employees, featuring role-based dashboards, asset requests, analytics, PDF generation, and more.

🔗 **Live Demo:** [https://assets-verse.web.app/](https://assets-verse.web.app/)

🔗 **Backend Repository:** [https://github.com/fardinislamselim/Asset-Verse-server](https://github.com/fardinislamselim/Asset-Verse-server)

## 🚀 Features (Client-Side)

### Authentication

- Email/password login
- Google Social Login (Firebase Authentication)
- JWT token storage and persistent login
- Protected routes with role-based redirection

### HR Manager Dashboard

- Company registration & package view
- Asset management (add/edit/delete)
- Employee request management (approve/reject)
- Direct asset assignment
- Package upgrade via Stripe checkout
- Analytics dashboard with Recharts:
  - Pie chart: Returnable vs Non-returnable assets
  - Bar chart: Top 5 most requested assets

### Employee Dashboard

- Independent user registration
- Request assets from any company
- View assigned assets across companies
- Return returnable assets
- Generate and download PDF reports of assigned assets
- View team members per company
- Profile management with image upload & live preview

### UI/UX Highlights

- Fully responsive (mobile, tablet, desktop)
- Professional corporate design using **Tailwind CSS** + **DaisyUI**
- Smooth animations with **Framer Motion**
- Toast notifications for user feedback
- Loading states and error handling

## 🛠️ Tech Stack

- **Framework:** React.js + Vite
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS + DaisyUI
- **Authentication:** Firebase Authentication
- **State Management:** React Context / Hooks
- **Data Fetching:** Axios
- **Charts:** Recharts
- **Animations:** Framer Motion
- **PDF Generation:** react-to-print + jsPDF
- **HTTP Client:** Axios

## 📦 NPM Packages

```bash
# Core
react
react-dom
react-router-dom

# UI & Styling
tailwindcss
daisyui
framer-motion

# Authentication
firebase

# Utilities
axios
recharts
react-to-print
jspdf
jspdf-autotable

# Development
vite
@Autowired
```

## 🏗️ Project Structure

```
src/
├── assets/               # Images, icons
├── components/           # Reusable UI components
├── contexts/             # Auth context
├── pages/                # Route pages (Home, Dashboard, etc.)
├── layouts/              # MainLayout, ProtectedLayout
├── hooks/                # Custom hooks
├── utils/                # Helper functions (e.g., PDF generation)
├── App.jsx
├── main.jsx
└── index.css
```

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-backend-url.com
# or for local development
# VITE_API_BASE_URL=https://assets-vers.vercel.app

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Important:** Prefix all variables with `VITE_` to expose them to the client.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/assetverse-client.git
cd assetverse-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env` file with your Firebase and backend URL.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

### 6. Preview Production Build

```bash
npm run preview
```

## 🧪 Test Credentials

- **HR Manager**  
  Email: `hr-1@assetsvers.com`  
  Password: 123456

- **Employee**  
  Register a new account directly in the app.

## 🚀 Deployment

Recommended: **Firebase**

Make sure to add all `VITE_` environment variables in the deployment dashboard.

## 🧑‍🤝‍🧑 Contributor

- **Your Name** – Full-Stack Developer  
  GitHub: [https://github.com/fardinislaselim](https://github.com/fardinislamselim)

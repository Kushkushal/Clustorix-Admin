# Clustorix Admin Portal (MERN Stack)

This is a complete MERN stack application boilerplate for the Clustorix Admin Portal, implementing the core features of Authentication, Dashboard, and School Management as requested.

## 🚀 Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

*   Node.js (v18+)
*   MongoDB (The application uses the provided MongoDB Atlas URI, so no local installation is strictly required, but a local MongoDB instance is recommended for development.)

### 1. Backend Setup (`server` directory)

1.  **Navigate to the server directory:**
    \`\`\`bash
    cd clustorix-admin-portal/server
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Configure Environment Variables:**
    The `.env` file is already created with the necessary variables:
    *   \`MONGO_URI\`: The MongoDB connection string provided in your prompt.
    *   \`JWT_SECRET\`: A secret key for JWT token generation.
    *   \`DEFAULT_ADMIN_EMAIL\`: \`admin@gmail.com\`
    *   \`DEFAULT_ADMIN_PASSWORD\`: \`Admin@123\`

4.  **Start the Server:**
    \`\`\`bash
    npm run dev
    # or npm start
    \`\`\`
    The server will start on port \`5001\`.

5.  **Initialize Super Admin:**
    Before logging in, you must initialize the default Super Admin user. Open your browser or a tool like Postman/cURL and make a **GET** request to:
    \`\`\`
    http://localhost:5001/api/v1/auth/init
    \`\`\`
    This will create the user \`admin@gmail.com\` with password \`Admin@123\` if it doesn't exist.

### 2. Frontend Setup (`client` directory)

1.  **Navigate to the client directory:**
    \`\`\`bash
    cd ../client
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

3.  **Start the Frontend Development Server:**
    \`\`\`bash
    npm run dev
    \`\`\`
    The client will start on port \`5173\` (or another available port).

### 3. Usage

1.  Open your browser to the client URL (e.g., \`http://localhost:5173\`).
2.  You will see the public landing page. Click **Admin Login**.
3.  Log in with the default credentials:
    *   **Email:** \`admin@gmail.com\`
    *   **Password:** \`Admin@123\`
4.  You will be redirected to the protected **Dashboard**.

## 📂 Project Structure

\`\`\`
clustorix-admin-portal/
├── client/                 # React Frontend (Vite, Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Layout, Sidebar, Header, ProtectedRoute)
│   │   ├── context/        # AuthContext for state management
│   │   ├── pages/          # Main application pages (Login, Dashboard, SchoolManagement)
│   │   ├── App.jsx         # Main router setup
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── server/                 # Node.js/Express Backend (MongoDB)
    ├── controllers/        # Business logic (authController, schoolController)
    ├── middleware/         # Authentication middleware (auth.js)
    ├── models/             # Mongoose schemas (User, School)
    ├── routes/             # API routes (authRoutes, schoolRoutes)
    ├── .env                # Environment variables (with your MONGO_URI)
    ├── package.json
    └── server.js           # Main server file
\`\`\`

## 📝 Core Features Implemented

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Authentication** | Admin Login, JWT-based protection, SuperAdmin initialization. | ✅ Complete |
| **Dashboard** | Overview widgets (mock data), Monthly registration chart (mock data). | ✅ Complete |
| **School Management** | List all schools, Toggle school \`isActive\` status (CRUD: Read, Update). | ✅ Complete |
| **UI/UX** | Modern, responsive layout with Tailwind CSS and a custom color palette. | ✅ Complete |

## 🛠️ Next Steps (For Full Implementation)

The current structure is highly scalable. To complete the full project as outlined in your prompt, you would need to:

1.  **Backend:** Create models, controllers, and routes for all other collections (Students, Teachers, Fees, Tickets, etc.).
2.  **Frontend:** Create the corresponding pages and components for Trainer Management, Subscription Management, and the full Ticketing System.
3.  **Real-time:** Integrate a solution like Socket.io for real-time updates (e.g., for tickets and feature toggles).
4.  **Styling:** Refine the Tailwind CSS to fully capture the "modern yet traditional Indian vibe."

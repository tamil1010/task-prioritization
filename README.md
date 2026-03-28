# 📌 Task Prioritization Agent

Task Prioritization Agent is an AI-assisted task management web application built using the MERN stack. The system helps users organize, prioritize, and manage tasks efficiently using intelligent suggestions and a clean productivity-focused interface.
The application allows users to create tasks, assign priorities, manage deadlines, and collaborate with others. An AI component analyzes task descriptions and suggests priority levels to help users focus on the most important work.
The project demonstrates full-stack development, RESTful API design, database integration, and AI service integration.

---

# 🚀 Key Features
**Smart Task Prioritization**
AI analyzes task descriptions and suggests priority levels.

**Task Management**
Create, update, delete, and track tasks efficiently.

**Deadline & Status Tracking**
Monitor task progress and completion status.

**Collaboration System**
Invite collaborators to tasks and manage shared work.

**Invitation Handling**
Users can accept or reject collaboration requests.

**Dashboard Overview**
View active tasks, completed tasks, and priority levels.

**MongoDB Data Storage**
Tasks, users, and collaboration data are stored persistently.

**Modern UI**
Clean productivity interface built with React and modern styling.

---

# 🧠 AI Integration

The system integrates with Groq/OpenAI APIs to analyze task descriptions and suggest priorities automatically.

Example:
Input:
"Prepare project presentation for tomorrow"
AI Suggested Priority:
**High**

# 🛠 Tech Stack

**Frontend**

- React
- Tailwind CSS
- Axios
- Vite

**Backend**

- Node.js
- Express.js
- JWT Authentication

**Database**

- MongoDB
- Mongoose

**AI Integration**

- Groq API / OpenAI API

---

# 📁 Project Structure
`
task-prioritization/
│
├── backend/
│   ├── controllers/
│   │   └── taskController.js
│   │
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── utils/
│   │   └── aiService.js
│   │
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── context/
│   │   │   └── TaskContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── vite.config.js
│
└── README.md
`

---

# ▶️ How to Run the Project
**✅ Prerequisites**

Make sure the following are installed:

- Node.js (v16 or above)
- MongoDB
- npm

---
  
# 1️⃣ Clone the Repository
`
git clone https://github.com/your-username/task-prioritization-agent.git
cd task-prioritization-agent
`

---

# 2️⃣ Backend Setup

**Navigate to the backend folder.**
`
cd backend
npm install
`
**Create a .env file:**
`
MONGO_URI=mongodb://127.0.0.1:27017/taskai
PORT=5000
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_api_key
`
**Start the backend server:**
`
npm start
`

**Backend runs on:**
`
http://localhost:5000
`

---

# 3️⃣ Frontend Setup

**Navigate to the frontend folder.**
`
cd frontend
npm install
npm run dev
`

**Frontend runs on:**
`
http://localhost:5173
`

---

# 📊 API Overview
| Method	| Endpoint |	Description |
| ------- | -------- | ------------ |
| POST | /api/auth/register |	Register user |
| POST	| /api/auth/login	| Login user |
| GET	| /api/tasks	| Get user tasks |
| POST	| /api/tasks | Create task |
| PUT	| /api/tasks/:id |	Update task |
| DELETE |	/api/tasks/:id |	Delete task |

---

# 🔐 Authentication

The application uses JWT authentication to protect task-related endpoints.
**Each request must include:**
`
Authorization: Bearer <token>
`

---

# 👤 Author

Tamilvani S

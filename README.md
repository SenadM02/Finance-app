# Finance App
 
A full-stack personal finance tracker for managing income and expenses. Users can register, log in, and track transactions with a running balance.
 
## Tech Stack
 
**Frontend:** React 19, React Router, React Hook Form, Vite  
**Backend:** Node.js, Express 5, MySQL, JWT authentication, bcrypt
 
## Features
 
- User registration and login
- Add income and expense transactions
- View transaction history
- See total income, total expenses, and current balance
- Delete individual transactions or clear all at once
- Protected routes — only accessible when logged in

### Prerequisites
 
- Node.js
- MySQL
### 1. Clone the repo
 
```bash
git clone https://github.com/your-username/Finance-app.git
cd Finance-app
```

### 2. Set up the database
 
Create a MySQL database and run your schema. Then create `backend/.env`:
 
```env
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=finance_app
PORT=3001
```

### 3. Start the backend
 
```bash
cd backend
npm install
node server.js
```
 
### 4. Start the frontend
 
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:
 
```env
VITE_API_URL=http://localhost:3001
```
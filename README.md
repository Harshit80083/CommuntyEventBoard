# Community Event Board

A full-stack community event management application with user authentication, role-based access, and MongoDB database.

## Features

- 🔐 **User Authentication** - Register and login with secure password hashing
- 👥 **User Roles** - Admin and regular user accounts with different permissions
- 📋 **Event Management** - Create, view, edit, and delete events
- 👤 **Event Attendance** - Join/leave events and track attendees
- 🔍 **Category Filter** - Filter events by category (Environmental, Technology, Charity, Sports, Music, Food, Art, Education)
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Clean UI** - Warm community-feel color palette
- 🗄️ **MongoDB Database** - Scalable, production-ready database

## Tech Stack

**Frontend:**
- Plain HTML, CSS, and vanilla JavaScript
- Responsive design with CSS Flexbox/Grid
- JWT token management in localStorage
- No frameworks or dependencies

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication with bcrypt password hashing
- Role-based access control (RBAC)

**Database:**
- MongoDB (local or Atlas cloud)
- Collections: Users, Events

## Quick Start

### Prerequisites
- Node.js and npm installed
- MongoDB running locally OR MongoDB Atlas account

### Installation

1. **Clone/Navigate to project:**
```bash
cd community-event-board-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup MongoDB:**
   - **Local:** Install MongoDB and run `mongod`
   - **Cloud:** Create Atlas cluster and copy connection string

4. **Configure environment:**
   
Edit `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/community-events
JWT_SECRET=your-secret-key-change-this-12345
PORT=3000
NODE_ENV=development
```

5. **Start the server:**
```bash
npm start
```

6. **Open in browser:**
```
http://localhost:3000
```

You'll be redirected to login page.

---

## User Workflow

### 1. Register
- Click "Register" on login page
- Enter name, email, password, and role (user/admin)
- Account is created and you're logged in

### 2. Browse Events
- See all community events on homepage
- Filter by category
- See attendee count for each event

### 3. Create Event
- Click "Add Event" in navbar
- Fill form with event details
- Event is created and appears for all users

### 4. Join Events
- Click "Join" button on any event card
- Your name added to attendees list
- Can click event to see full details

### 5. Manage Events
- Created events: Edit or delete your own events
- Admin users: Can delete any event or user

---

## Project Structure

```
community-event-board-app/
├── server.js                 # Express backend with MongoDB
├── .env                      # Configuration (don't commit!)
├── package.json              # Dependencies
├── models/
│   ├── User.js              # User schema with auth
│   └── Event.js             # Event schema with relationships
├── middleware/
│   └── auth.js              # JWT & role verification
├── public/
│   ├── login.html           # Auth page (register/login)
│   ├── index.html           # Event listing page
│   ├── add-event.html       # Create event form
│   ├── event-detail.html    # Event details page
│   ├── style.css            # Styling
│   └── script.js            # Frontend helpers
├── MONGODB_SETUP.md         # Detailed MongoDB setup guide
├── VIVA_PREP.md             # Interview preparation guide
└── README.md                # This file
```

---

## API Endpoints

### Authentication
```
POST /api/auth/register
  {name, email, password, role}
  
POST /api/auth/login
  {email, password}
  Returns: {token, user}
```

### Events (Require JWT Token)
```
GET /api/events
  Get all events with attendee info
  
GET /api/events/:id
  Get single event details
  
POST /api/events
  Create new event
  Body: {title, description, date, time, location, category}
  
PUT /api/events/:id
  Update event (creator/admin only)
  
DELETE /api/events/:id
  Delete event (creator/admin only)
  
POST /api/events/:id/join
  Add user to attendees
  
POST /api/events/:id/leave
  Remove user from attendees
```

### Admin Only (Require Admin JWT Token)
```
GET /api/admin/users
  List all users
  
DELETE /api/admin/users/:id
  Delete user account
```

---

## Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: String (user/admin),
  createdAt: Date
}
```

### Event Schema
```javascript
{
  title: String,
  description: String,
  date: String,
  time: String,
  location: String,
  category: String,
  createdBy: ObjectId (User reference),
  attendees: [ObjectId] (User references),
  attendeeCount: Number,
  createdAt: Date
}
```

---

## Color Palette

- **Primary:** #2d5f4f (Dark Forest Green)
- **Accent:** #d97706 (Warm Orange)
- **Background:** #f5f3f0 (Creamy White)
- **Cards:** #fff (White)

---

## Security Features

✅ **Password Security**
- Passwords hashed with bcrypt
- Passwords never stored in plain text
- Passwords never sent in responses

✅ **Authentication**
- JWT tokens valid for 7 days
- Tokens stored in browser localStorage
- Tokens sent in Authorization header

✅ **Authorization**
- Users can only edit/delete their own events
- Admins can delete any event or user
- Protected routes require valid token

✅ **Data Validation**
- Forms validated on frontend
- All inputs validated on backend
- No invalid data saved to database

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running
```bash
mongod  # Start MongoDB server
# Or check MongoDB Atlas connection


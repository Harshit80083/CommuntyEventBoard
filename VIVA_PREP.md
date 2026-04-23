# COMMUNITY EVENT BOARD - VIVA INTERVIEW PREPARATION

## Overview Questions

### 1. What is MongoDB and why did you choose it over JSON file storage?
**Answer:** MongoDB is a NoSQL database that stores data in JSON-like documents. I chose it because:
- Handles large amounts of data efficiently
- Supports complex queries and filtering
- Multiple concurrent users can access data safely
- Data persists permanently (unlike JSON files which can be deleted)
- Scales better for production applications

### 2. What are the key differences between your JSON version and MongoDB version?
**Answer:**
- **JSON:** Data stored in a single file using fs module, no user authentication, no relationships between users and events
- **MongoDB:** Data stored in collections with proper relationships, user authentication with JWT tokens, role-based access control

### 3. Explain the architecture of your application
**Answer:** It's a three-tier architecture:
- **Frontend:** HTML, CSS, JavaScript pages with user interface (login, events, add-event)
- **Backend:** Node.js/Express server handling API routes and business logic
- **Database:** MongoDB storing users and events with proper relationships

---

## BACKEND QUESTIONS

### 4. What is an API endpoint and how many do you have?
**Answer:** An API endpoint is a URL where the backend accepts requests and sends responses. My main endpoints are:
- **Auth:** `/api/auth/register`, `/api/auth/login`
- **Events:** `GET /api/events`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`
- **Join/Leave:** `POST /api/events/:id/join`, `POST /api/events/:id/leave`
- **Admin:** `GET /api/admin/users`, `DELETE /api/admin/users/:id`

### 5. What is middleware and why do you use it?
**Answer:** Middleware are functions that process requests before they reach the route handler. I use:
- `express.json()` - Parse JSON request bodies
- `cors()` - Allow requests from different domains
- `authMiddleware` - Verify user is logged in by checking JWT token
- `adminMiddleware` - Verify user has admin role

### 6. Explain JWT (JSON Web Token) and how you implement it
**Answer:** JWT is a token-based authentication method. When user logs in:
1. Server creates a token containing user's id, email, and role
2. Token is signed with a secret key
3. Frontend stores token in localStorage
4. For every request, frontend sends token in Authorization header
5. Backend verifies the token using the secret key

Advantages: Stateless, secure, and doesn't require server sessions

### 7. What is password hashing and why is it important?
**Answer:** Password hashing converts plain passwords into unreadable strings using bcrypt. This is important because:
- Even if database is hacked, passwords are not readable
- If two users have same password, hashes are different
- It's one-way (can't convert hash back to password)
- Salting adds extra security by adding random data

### 8. How do you handle authorization? What's the difference between Authentication and Authorization?
**Answer:**
- **Authentication:** Verifying who the user is (login with email/password)
- **Authorization:** Checking what the user can do (only event creator can delete their event)

I handle this by:
- Admin can delete any event or user
- Regular user can only delete their own events
- Checked using `if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin')`

### 9. What is async/await and why do you use it?
**Answer:** Async/await allows writing asynchronous code in a synchronous style. I use it for database operations:
- `await mongoose.connect()` - Wait for database connection
- `await Event.findById()` - Wait for database query to complete
- `await newEvent.save()` - Wait for data to be saved

Without it, code would need complex callbacks or promises.

### 10. Explain error handling in your project
**Answer:** I use try/catch blocks:
```javascript
try {
  // code that might fail
  let event = await Event.findById(id);
} catch (err) {
  // handle error
  console.log('error', err);
  res.status(500).json({ error: 'error message' });
}
```

### 11. What is a database schema and what's yours?
**Answer:** A schema defines the structure of data. My schemas:
- **User Schema:** name, email, password (hashed), role (user/admin), createdAt
- **Event Schema:** title, description, date, time, location, category, createdBy (ObjectId), attendees (array), attendeeCount, createdAt

### 12. What is populate() in Mongoose?
**Answer:** `populate()` replaces ObjectIds with actual data from referenced collections. Example:
- `Event.populate('createdBy')` replaces createdBy ID with full user object (name, email)
- `Event.populate('attendees')` shows all attendees with their details

### 13. How do you validate form input on the backend?
**Answer:** I check if required fields are empty or have invalid values:
```javascript
if (!email || email.trim() === '') {
  return res.status(400).json({ error: 'email required' });
}
```
This prevents invalid data from being saved to database.

### 14. What's the difference between POST, PUT, and DELETE?
**Answer:**
- **POST:** Create new data (`POST /api/events` creates new event)
- **PUT:** Update existing data (`PUT /api/events/:id` updates event)
- **DELETE:** Remove data (`DELETE /api/events/:id` deletes event)

---

## FRONTEND QUESTIONS

### 15. How do you check if user is logged in on the frontend?
**Answer:** I check for authToken in localStorage:
```javascript
let token = localStorage.getItem('authToken');
if (!token) {
  window.location.href = 'login.html';
}
```
If no token, redirect to login page.

### 16. How do you send JWT token with requests?
**Answer:** I add it to Authorization header:
```javascript
fetch('/api/events', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

### 17. How do you decode JWT token on frontend without a library?
**Answer:**
```javascript
let parts = token.split('.');
let payload = JSON.parse(atob(parts[1]));
// Now payload contains user id, email, role
```
The token has 3 parts separated by dots; the middle one is the payload in base64.

### 18. Explain localStorage and why you use it
**Answer:** localStorage is browser storage that persists after page refresh. I use it to:
- Store authToken so user doesn't need to login on every page load
- Store userName to display greeting
- Store userRole to check permissions

### 19. How do you handle form validation on frontend?
**Answer:** Before sending to backend, I check:
```javascript
if (!email || !password) {
  showMessage('Email and password required', 'error');
  return;
}
```
This gives instant feedback without making unnecessary API calls.

### 20. How do you display different buttons based on user role/ownership?
**Answer:** I check user ownership in JavaScript:
```javascript
if (event.createdBy._id === currentUserId) {
  // Show delete button
} else {
  // Hide delete button
}
```

---

## GENERAL TECHNICAL QUESTIONS

### 21. What is CORS and why is it needed?
**Answer:** CORS (Cross-Origin Resource Sharing) allows frontend on one domain to access backend on different port. I enable it:
```javascript
app.use(cors());
```
Without it, browser blocks requests between different origins (localhost:3000 to localhost:5000).

### 22. What's the difference between let, var, and const?
**Answer:**
- **var:** Function-scoped, can be redeclared (avoid using)
- **let:** Block-scoped, can't be redeclared (use this)
- **const:** Block-scoped, can't be changed after declaration (use for constants)

### 23. What is a Promise and async/await?
**Answer:** Promise represents a value that will be available in future:
```javascript
fetch('/api/events')  // Returns promise
  .then(res => res.json())  // When resolved
  .catch(err => {})  // If error
```

Async/await is cleaner syntax:
```javascript
async function loadEvents() {
  let res = await fetch('/api/events');
  let data = await res.json();
}
```

### 24. How would you improve your project?
**Answer:**
- Add user profiles with profile pictures
- Email verification for new accounts
- Search and advanced filtering
- Pagination for large event lists
- Database backup system
- Unit tests for all endpoints
- API rate limiting to prevent abuse
- Event edit functionality
- Comments/reviews on events

### 25. What did you learn from this project?
**Answer:**
- Understanding full-stack development (frontend + backend + database)
- How authentication and authorization work in production
- Importance of proper error handling
- Why databases are better than files for applications
- API design principles
- How tokens work for security
- Working with async operations
- ORM benefits (Mongoose)

---

## DATABASE QUESTIONS

### 26. What is a relationship in a database and how do you use it?
**Answer:** Relationships connect data in different collections. I use:
- **One-to-Many:** One user creates many events (createdBy references User)
- **Many-to-Many:** Many users attend many events (attendees array)

Example:
```javascript
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'   // Links to User collection
}
```

### 27. What's the difference between relational and NoSQL databases?
**Answer:**
- **Relational (SQL):** Fixed schema in tables with strict relationships
- **NoSQL (MongoDB):** Flexible schema with documents, easier to scale horizontally

### 28. How would you handle database backups?
**Answer:** For production:
- MongoDB Atlas provides automatic daily backups
- Schedule periodic exports to local storage
- Use point-in-time recovery features
- Test backups regularly to ensure they work

---

## SECURITY QUESTIONS

### 29. What security measures do you have in place?
**Answer:**
- Password hashing with bcrypt (can't see actual passwords)
- JWT tokens expire after 7 days
- User can only edit their own events (authorization check)
- Input validation to prevent invalid data
- CORS to prevent unauthorized requests
- Don't store tokens in URL (use Authorization header)

### 30. How would you prevent SQL injection?
**Answer:** I use Mongoose which sanitizes inputs automatically. If using SQL:
- Use parameterized queries instead of string concatenation
- Never trust user input directly
- Use prepared statements

---

## DEPLOYMENT QUESTIONS

### 31. How would you deploy this application?
**Answer:**
1. **Database:** Use MongoDB Atlas (cloud MongoDB)
2. **Backend:** Deploy to Heroku, AWS, or DigitalOcean
3. **Frontend:** Deploy HTML/CSS/JS to Netlify or Vercel
4. **Environment variables:** Store secret keys separately, not in code
5. **CI/CD:** Set up automatic testing and deployment on code changes

### 32. What environment variables do you use and why?
**Answer:**
- `MONGODB_URI` - Database connection string (different for dev/production)
- `JWT_SECRET` - Secret key for signing tokens (never expose)
- `PORT` - Server port (can vary by environment)
- `NODE_ENV` - Development or production mode

This way you can deploy same code to different servers with different configs.

---

## QUICK VIVA CHECKLIST

Before your viva, know:
✅ How to explain your architecture (3-tier)
✅ What MongoDB is and why you used it
✅ How JWT authentication works (step by step)
✅ Difference between authentication and authorization
✅ What async/await does
✅ How to explain one of your API endpoints in detail
✅ What CORS is
✅ How you handle errors
✅ What schemas you defined and why
✅ How role-based access works

---

## SAMPLE VIVA QUESTIONS (Practice Answers)

**Q: Walk me through what happens when a user creates an event**
**A:** 
1. User fills form and clicks "Create Event"
2. Frontend validates form (title, description, date, location, category)
3. Frontend makes POST request to `/api/events` with JWT token
4. Backend authMiddleware verifies token
5. Backend validates fields again
6. Backend creates new Event document with createdBy = current user
7. Event is saved to MongoDB
8. Response is sent back with event data
9. Frontend shows success message and redirects to home
10. New event appears in list for all users

---

## GLOSSARY OF TERMS

- **API:** Application Programming Interface - way for frontend and backend to communicate
- **JWT:** JSON Web Token - secure way to transmit user info
- **MongoDB:** NoSQL database using documents (like JSON objects)
- **Mongoose:** Library to interact with MongoDB from Node.js
- **bcrypt:** Library to hash passwords securely
- **CORS:** Cross-Origin Resource Sharing - allows requests between different origins
- **Middleware:** Function that processes requests before they reach route handlers
- **Async/Await:** Syntax to write cleaner asynchronous code
- **Schema:** Blueprint for data structure in database
- **Authentication:** Verifying user identity (login)
- **Authorization:** Checking what user can do (permissions)
- **Populate:** Mongoose method to replace ObjectIds with actual data
- **Payload:** The data inside a JWT token
- **localStorage:** Browser storage that persists after refresh
- **Route:** URL path that handles requests (`/api/events`, `/api/login`, etc.)


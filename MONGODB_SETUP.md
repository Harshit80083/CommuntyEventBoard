# MongoDB Setup & Migration Guide

## What Changed from JSON to MongoDB?

### BEFORE (JSON File)
- Events stored in `events.json` file
- No user authentication
- No relationships between users and events
- Limited to single-file operations

### NOW (MongoDB)
- Events stored in MongoDB database
- User authentication with JWT tokens
- Admin and user roles
- Events linked to user who created them
- Attendee tracking per user
- Production-ready architecture

---

## STEP 1: Install MongoDB

### Option A: MongoDB Community Server (Local Installation)

**On macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Follow installation wizard
- MongoDB will run as a service automatically

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud) - RECOMMENDED FOR PRODUCTION

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Add username and password
6. Update `.env` with connection string

Example `.env` for Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/community-events?retryWrites=true&w=majority
```

---

## STEP 2: Check MongoDB is Running

**On macOS/Linux:**
```bash
mongo
```

You should see a prompt like `>`

Type `exit` to quit.

**On Windows:**
- Check Services app to verify MongoDB is running
- Or run `mongosh` command

---

## STEP 3: Install Dependencies

```bash
cd community-event-board-app
npm install
```

This installs:
- `express` - Web server
- `mongoose` - MongoDB connector
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `cors` - Allow cross-origin requests
- `dotenv` - Environment variables

---

## STEP 4: Update .env File

The `.env` file is already created. Update these values:

```
MONGODB_URI=mongodb://localhost:27017/community-events
JWT_SECRET=your-secret-key-change-this-in-production-12345
PORT=3000
NODE_ENV=development
```

**For Production:**
- Use MongoDB Atlas connection string
- Change JWT_SECRET to something unique
- Set NODE_ENV=production

---

## STEP 5: Start the Server

```bash
npm start
```

You should see:
```
connected to mongodb
server running on http://localhost:3000
```

---

## STEP 6: Open in Browser

Go to: **http://localhost:3000**

You will be redirected to login page.

---

## NEW PROJECT STRUCTURE

```
community-event-board-app/
├── server.js                 # Backend with MongoDB code
├── .env                      # Configuration (GITIGNORE THIS!)
├── package.json
├── models/
│   ├── User.js              # User schema with password hashing
│   └── Event.js             # Event schema with relationships
├── middleware/
│   └── auth.js              # JWT verification & admin check
├── public/
│   ├── login.html           # NEW: Login/Register page
│   ├── index.html           # Event list (now requires login)
│   ├── add-event.html       # Create event (updated)
│   ├── event-detail.html    # Event details (updated)
│   ├── style.css
│   └── script.js
├── events.json              # NO LONGER USED (keep for reference)
└── README.md
```

---

## USER ROLES & PERMISSIONS

### Regular User
- ✅ Register and login
- ✅ View all events
- ✅ Create new events
- ✅ Join/leave events
- ✅ Edit their own events
- ✅ Delete their own events
- ❌ Delete other users' events
- ❌ Delete other users

### Admin User
- ✅ All user permissions
- ✅ Delete any event
- ✅ Delete any user
- ✅ View all users

---

## API ENDPOINTS (Updated)

### Authentication
```
POST /api/auth/register
  Body: {name, email, password, role}
  
POST /api/auth/login
  Body: {email, password}
  Returns: {token, user}
```

### Events
```
GET /api/events
  Headers: Authorization: Bearer token
  
GET /api/events/:id
POST /api/events
  Requires: token, {title, description, date, time, location, category}
  
PUT /api/events/:id
  Requires: token (only creator/admin)
  
DELETE /api/events/:id
  Requires: token (only creator/admin)
  
POST /api/events/:id/join
  Requires: token
  
POST /api/events/:id/leave
  Requires: token
```

### Admin Only
```
GET /api/admin/users
  Requires: admin token
  
DELETE /api/admin/users/:id
  Requires: admin token
```

---

## TESTING THE API

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

Response:
```json
{
  "message": "user registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create Event

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Community Cleanup",
    "description": "Help clean the park",
    "date": "2026-04-20",
    "time": "09:00",
    "location": "Central Park",
    "category": "Environmental"
  }'
```

### 4. Get All Events

```bash
curl http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check MongoDB is running: `brew services list` (macOS)
- Check connection string in `.env`
- Verify port 27017 is open

### Issue: "Invalid token"
**Solution:**
- Token might have expired (valid for 7 days)
- Make sure to pass `Bearer ` prefix in header
- Check localStorage in browser

### Issue: "EADDRINUSE: address already in use :::3000"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=4000 npm start
```

### Issue: "Email already registered"
**Solution:**
- User with that email already exists
- Try different email or login instead

### Issue: Password doesn't work
**Solution:**
- Password is hashed in database (can't see actual password)
- If you forget password, would need password reset feature
- Try registering new account

---

## WHAT TO SHOW IN YOUR VIVA

### Show the Schema Design
```
Open models/User.js and models/Event.js in your editor
Explain what each field does
Explain relationships (createdBy, attendees array)
```

### Show Authentication Flow
```
1. Open public/login.html
2. Register new account
3. Show token in browser localStorage (F12 > Application tab)
4. Show how token is sent in Authorization header (F12 > Network)
5. Explain JWT structure (header.payload.signature)
```

### Show Backend Code
```
Open server.js
Explain the routes
Show middleware usage (authMiddleware, adminMiddleware)
Show how password hashing works (User.js)
```

### Show Role-Based Access
```
1. Create event as regular user
2. Try to delete another user's event (fails)
3. Login as admin
4. Delete other user's event (works)
Explain adminMiddleware code
```

### Show Database Structure
```
Use MongoDB Compass or Atlas UI to show:
- Community-events database
- Users collection
- Events collection
- How events reference users
```

---

## MIGRATION FROM JSON

If you want to migrate old events from `events.json`:

```javascript
// In server.js after DB connects
async function migrateEventsFromJson() {
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('events.json', 'utf8'));
  
  // Get a user first or create one
  let user = await User.findOne();
  if (!user) {
    user = new User({name: 'System', email: 'system@localhost', password: 'temp'});
    await user.save();
  }
  
  // Convert old events
  for (let oldEvent of data) {
    let newEvent = new Event({
      ...oldEvent,
      createdBy: user._id,
      attendees: [user._id]
    });
    await newEvent.save();
  }
  console.log('Migration complete');
}
```

---

## NEXT STEPS FOR IMPROVEMENT

1. **Add Password Reset** - Email confirmation link to reset password
2. **Add Search** - Find events by keyword/title
3. **Add Event Categories** - Filter by category on frontend
4. **Add User Profiles** - Show user's created events and joined events
5. **Add Event Images** - Use Cloudinary or similar
6. **Add Reviews** - Users can leave comments on events
7. **Add Notifications** - Alert users when event details change
8. **Add Pagination** - Load events in chunks (for performance)
9. **Add Email Alerts** - Send email reminders before event
10. **Add Unit Tests** - Test endpoints with Jest/Mocha

---

## HELPFUL COMMANDS

```bash
# View MongoDB databases and collections
mongo
> use community-events
> db.users.find()
> db.events.find()
> exit

# Clear all events from database
mongo
> use community-events
> db.events.deleteMany({})

# Find a specific user
> db.users.findOne({email: "john@example.com"})

# Count total events
> db.events.countDocuments()

# Delete all data and restart
> db.dropDatabase()
```

---

## SECURITY REMINDERS

⚠️ **NEVER COMMIT .env FILE TO GIT**
- Add to .gitignore
- Passwords and secrets are inside

⚠️ **NEVER HARDCODE SECRETS**
- Always use environment variables
- Different secret for production

⚠️ **VALIDATE ALL INPUTS**
- Check frontend validation
- Always validate on backend too
- Never trust user input

⚠️ **USE HTTPS IN PRODUCTION**
- Encrypt all communication
- Use Let's Encrypt for free certificates

⚠️ **ROTATE JWT SECRET PERIODICALLY**
- Old tokens become invalid after rotation
- Users need to login again


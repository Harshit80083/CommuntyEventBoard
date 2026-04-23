# SETUP IN 3 STEPS

## STEP 1: Start MongoDB

### Option A: Local MongoDB (macOS)
```bash
brew services start mongodb-community
```

### Option B: Local MongoDB (Windows)
- MongoDB runs automatically as a service
- If not running, start it from Services app

### Option C: Cloud MongoDB (Easiest)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (takes 2-3 minutes)
4. Copy connection string
5. Update in `.env` file

---

## STEP 2: Install & Run

```bash
# Navigate to project
cd community-event-board-app

# Install all packages
npm install

# Start server
npm start
```

You should see:
```
connected to mongodb
server running on http://localhost:3000
```

---

## STEP 3: Open in Browser

Go to: **http://localhost:3000**

You'll see login page. Register a new account and start using the app!

---

## THAT'S IT! 

The app is now running with MongoDB as database.

All events and users will be saved persistently.

---

## QUICK TIPS

**If you get "Cannot connect to MongoDB":**
- Make sure MongoDB is really running
- Check connection string in `.env`
- Try cloud MongoDB (Atlas) instead

**To stop the server:**
```
Press Ctrl + C
```

**To restart:**
```bash
npm start
```

**To view your database:**
- **Local:** Install MongoDB Compass (GUI app)
- **Cloud:** Use MongoDB Atlas dashboard

**Test with Admin Account:**
```
Email: admin@test.com
Password: admin123
Role: admin
```

Then admin can delete any event or any user.

---

## WHAT'S NEW vs OLD VERSION?

| Feature | Old (JSON) | New (MongoDB) |
|---------|-----------|---------------|
| Database | File (events.json) | MongoDB (cloud/local) |
| Users | No user accounts | Full auth system |
| Login | None | Email + password |
| Admin | No admin | Admin with special powers |
| Security | No password hashing | bcrypt + JWT tokens |
| Scalability | Limited | Production-ready |
| Events Data | Just a number for attendees | Full user references |


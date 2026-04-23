const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Event = require('./models/Event');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// connect to mongodb
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to mongodb');
  } catch (err) {
    console.log('mongodb connection error', err);
    process.exit(1);
  }
}

connectDB();

// AUTHENTICATION ROUTES

// POST register user
app.post('/api/auth/register', async (req, res) => {
  try {
    var name = req.body.name;
    var email = req.body.email;
    let password = req.body.password;
    let role = req.body.role || 'user';
    
    // validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'name required' });
    }
    
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'email required' });
    }
    
    if (!password || password.trim() === '') {
      return res.status(400).json({ error: 'password required' });
    }
    
    // check if user exists
    let existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: 'email already registered' });
    }
    
    // create new user
    let newUser = new User({
      name: name,
      email: email,
      password: password,
      role: role
    });
    
    // save user
    await newUser.save();
    
    // create jwt token
    let token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'user registered successfully',
      token: token,
      user: newUser.getPublicProfile()
    });
  } catch (err) {
    console.log('registration error', err);
    res.status(500).json({ error: 'error registering user' });
  }
});

// POST login user
app.post('/api/auth/login', async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    
    // validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    
    // find user
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'invalid email or password' });
    }
    
    // check password
    let isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'invalid email or password' });
    }
    
    // create token
    let token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'login successful',
      token: token,
      user: user.getPublicProfile()
    });
  } catch (err) {
    console.log('login error', err);
    res.status(500).json({ error: 'error logging in' });
  }
});


// EVENT ROUTES

// GET all events
app.get('/api/events', async (req, res) => {
  try {
    let events = await Event.find().populate('createdBy', 'name email').populate('attendees', 'name email');
    res.json(events);
  } catch (err) {
    console.log('error getting events', err);
    res.status(500).json({ error: 'error getting events' });
  }
});

// GET events by category
app.get('/api/events/category/:category', async (req, res) => {
  try {
    let category = req.params.category;
    let events = await Event.find({ category: category }).populate('createdBy', 'name email');
    res.json(events);
  } catch (err) {
    console.log('error getting category events', err);
    res.status(500).json({ error: 'error getting category events' });
  }
});

// GET events user is attending
app.get('/api/events/my-attending', authMiddleware, async (req, res) => {
  try {
    let events = await Event.find({ attendees: new mongoose.Types.ObjectId(req.user.id) }).populate('createdBy', 'name email').populate('attendees', 'name email');
    res.json(events);
  } catch (err) {
    console.log('error getting attending events', err);
    res.status(500).json({ error: 'error getting attending events' });
  }
});

// GET single event
app.get('/api/events/:id', async (req, res) => {
  try {
    let event = await Event.findById(req.params.id).populate('createdBy', 'name email').populate('attendees', 'name email');
    
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.log('error getting event', err);
    res.status(500).json({ error: 'error getting event' });
  }
});

// POST create event (requires auth)
app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    // check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'only admins can create events' });
    }
    
    var title = req.body.title;
    var description = req.body.description;
    let date = req.body.date;
    let time = req.body.time;
    let location = req.body.location;
    var category = req.body.category;
    
    // validate
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'title required' });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'description required' });
    }
    
    if (!date || date.trim() === '') {
      return res.status(400).json({ error: 'date required' });
    }
    
    if (!location || location.trim() === '') {
      return res.status(400).json({ error: 'location required' });
    }
    
    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'category required' });
    }
    
    // create event
    let newEvent = new Event({
      title: title,
      description: description,
      date: date,
      time: time || '00:00',
      location: location,
      category: category,
      createdBy: req.user.id,
      attendees: [new mongoose.Types.ObjectId(req.user.id)],
      attendeeCount: 1
    });
    
    // save
    await newEvent.save();
    await newEvent.populate('createdBy', 'name email');
    
    res.status(201).json(newEvent);
  } catch (err) {
    console.log('error creating event', err);
    res.status(500).json({ error: 'error creating event' });
  }
});

// PUT update event (only creator or admin)
app.put('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }
    
    // check if user is creator or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'you can only edit your own events' });
    }
    
    // update fields
    let data = req.body;
    if (data.title) event.title = data.title;
    if (data.description) event.description = data.description;
    if (data.date) event.date = data.date;
    if (data.time) event.time = data.time;
    if (data.location) event.location = data.location;
    if (data.category) event.category = data.category;
    
    // save
    await event.save();
    await event.populate('createdBy', 'name email');
    
    res.json(event);
  } catch (err) {
    console.log('error updating event', err);
    res.status(500).json({ error: 'error updating event' });
  }
});

// DELETE event (only creator or admin)
app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }
    
    // check if user is creator or admin
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'you can only delete your own events' });
    }
    
    // delete
    await Event.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'event deleted' });
  } catch (err) {
    console.log('error deleting event', err);
    res.status(500).json({ error: 'error deleting event' });
  }
});

// POST join event
app.post('/api/events/:id/join', authMiddleware, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }
    
    // check if already attending
    let isAttending = false;
    for (let i = 0; i < event.attendees.length; i++) {
      if (event.attendees[i].toString() === req.user.id) {
        isAttending = true;
        break;
      }
    }
    
    if (isAttending) {
      return res.status(400).json({ error: 'you are already attending this event' });
    }
    
    // add attendee
    event.attendees.push(new mongoose.Types.ObjectId(req.user.id));
    event.attendeeCount = event.attendees.length;
    
    await event.save();
    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');
    
    res.json(event);
  } catch (err) {
    console.log('error joining event', err);
    res.status(500).json({ error: 'error joining event' });
  }
});

// POST leave event
app.post('/api/events/:id/leave', authMiddleware, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'event not found' });
    }
    
    // remove from attendees
    let newAttendees = [];
    for (let i = 0; i < event.attendees.length; i++) {
      if (event.attendees[i].toString() !== req.user.id) {
        newAttendees.push(event.attendees[i]);
      }
    }
    
    event.attendees = newAttendees;
    event.attendeeCount = event.attendees.length;
    
    await event.save();
    
    res.json(event);
  } catch (err) {
    console.log('error leaving event', err);
    res.status(500).json({ error: 'error leaving event' });
  }
});

// ADMIN ROUTES

// GET all users (admin only)
app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.log('error getting users', err);
    res.status(500).json({ error: 'error getting users' });
  }
});

// DELETE user (admin only)
app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    
    res.json({ message: 'user deleted' });
  } catch (err) {
    console.log('error deleting user', err);
    res.status(500).json({ error: 'error deleting user' });
  }
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server running on http://localhost:' + PORT);
});

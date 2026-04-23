const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // generate salt
    let salt = await bcrypt.genSalt(10);
    // hash password
    let hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.log('error hashing password', err);
    next(err);
  }
});

// method to compare passwords
userSchema.methods.comparePassword = async function(plainPassword) {
  try {
    let isMatch = await bcrypt.compare(plainPassword, this.password);
    return isMatch;
  } catch (err) {
    console.log('error comparing password', err);
    return false;
  }
};

// method to get user without password
userSchema.methods.getPublicProfile = function() {
  let userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

module.exports = mongoose.model('User', userSchema);

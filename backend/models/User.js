const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      // hides password from queries by default
      select: false,
    },

    // Array of valid refresh tokens for token rotation tracking
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ======================================
// HASH PASSWORD BEFORE SAVE
// ======================================
userSchema.pre('save', async function () {
  // If the password hasn't been modified, exit the middleware early
  if (!this.isModified('password')) {
    return;
  }

  // Hash the password automatically before saving to the database
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error('Password hashing failed: ' + error.message);
  }
});

// ======================================
// MATCH PASSWORD METHOD
// ======================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
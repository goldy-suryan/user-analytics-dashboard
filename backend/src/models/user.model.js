import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    signup_date: {
      type: Date,
      required: true,
      index: true
    },
    age: {
      type: Number,
      min: 0,
      max: 100
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      index: true
    },
    country: {
      type: String,
      index: true
    },
    device_type: {
      type: String,
      enum: ['web', 'android', 'ios'],
      index: true
    },
    acquisition_channel: {
      type: String,
      enum: ['organic', 'ads', 'referral']
    },
    plan_type: {
      type: String,
      enum: ['free', 'trial', 'paid'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for analytics filters
userSchema.index({ gender: 1, country: 1, device_type: 1 });

export default mongoose.model('User', userSchema);

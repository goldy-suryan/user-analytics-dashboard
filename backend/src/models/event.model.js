import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    event_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user_id: {
      type: String,
      required: true,
      index: true
    },
    event_name: {
      type: String,
      enum: ['login', 'view', 'add_to_cart', 'purchase'],
      required: true,
      index: true
    },
    event_timestamp: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: false
  }
);

// for active user queries
eventSchema.index({ user_id: 1, event_timestamp: -1 });

export default mongoose.model('Event', eventSchema);

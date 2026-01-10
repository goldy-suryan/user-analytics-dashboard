import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transaction_id: {
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    transaction_date: {
      type: Date,
      required: true,
      index: true
    },
    payment_status: {
      type: String,
      enum: ['success', 'failed'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

transactionSchema.index({ payment_status: 1, transaction_date: -1 });

export default mongoose.model('Transaction', transactionSchema);

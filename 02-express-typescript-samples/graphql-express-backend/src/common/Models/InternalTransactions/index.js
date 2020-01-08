import mongoose, {
  Schema
} from 'mongoose';

import InternalTransactionStatusEnum from './enums/InternalTransactionStatusEnum';

const InternalTransactionSchema = new Schema({
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: InternalTransactionStatusEnum,
    required: true,
    default: InternalTransactionStatusEnum.PENDING
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: '__version'
});

InternalTransactionSchema.pre('save', (next) => {
  this.increment();
  return next();
});

InternalTransactionSchema.pre('update', (next) => {
  this.update({}, { $inc: { __version: 1 } }, next);
});

const InternalTransactionModel = mongoose.model('sessions', InternalTransactionSchema);

export default InternalTransactionModel;

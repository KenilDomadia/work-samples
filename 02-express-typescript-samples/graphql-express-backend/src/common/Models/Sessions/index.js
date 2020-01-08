import mongoose, {
  Schema
} from 'mongoose';

const SessionSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  deviceToken: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: '__version'
});

SessionSchema.pre('save', (next) => {
  this.increment();
  return next();
});

SessionSchema.pre('update', (next) => {
  this.update({}, { $inc: { __version: 1 } }, next);
});

const SessionModel = mongoose.model('sessions', SessionSchema);

export default SessionModel;

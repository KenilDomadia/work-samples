import mongoose, {
  Schema
} from 'mongoose';
import UserStatusEnum from './enums/UserStatusEnum';
import UserSignUpTypeEnum from './enums/UserSignUpTypeEnum';
import UserGenderEnum from './enums/UserGenderEnum';

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    index: {
      unique: true
    }
  },
  cell: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  countryCode: {
    type: String,
    required: true,
    default: '+91'
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: Object.values(UserGenderEnum),
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  cellVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  kycVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  signUpType: {
    type: String,
    enum: Object.values(UserSignUpTypeEnum),
    required: true,
    default: UserSignUpTypeEnum.EMAIL
  },
  status: {
    type: String,
    required: true,
    default: UserStatusEnum.ACTIVE,
    enum: Object.values(UserStatusEnum)
  }
}, {
  timestamps: true,
  versionKey: '__version'
});

UserSchema.pre('save', (next) => {
  this.increment();
  return next();
});

UserSchema.pre('update', (next) => {
  this.update({}, { $inc: { __version: 1 } }, next);
});

const UserModel = mongoose.model('users', UserSchema);
UserModel.UserStatusEnum = UserStatusEnum;
UserModel.UserSignUpTypeEnum = UserSignUpTypeEnum;

export default UserModel;

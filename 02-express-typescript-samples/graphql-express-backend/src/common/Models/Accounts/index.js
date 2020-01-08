import mongoose, {
  Schema
} from 'mongoose';

import CurrencyTypeEnum from '../../Enums/CurrencyTypeEnum';
import AccountTypeEnum from './enums/AccountTypeEnum';

const WalletSchema = new Schema({
  currencyType: {
    type: String,
    enum: Object.values(CurrencyTypeEnum)
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  promotionalBalance: {
    type: Number,
    min: 0
  },
  reservedBalance: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  _id: false
});

const AccountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: {
      unique: true
    }
  },
  type: {
    type: String,
    enum: Object.values(AccountTypeEnum),
    required: true,
    default: AccountTypeEnum.INDIVIDUAL
  },
  wallets: {
    type: [WalletSchema],
    required: true
  }
}, {
  timestamps: true,
  versionKey: '__version'
});

AccountSchema.pre('save', function blockSaveOnUpdate(next) {
  if (!this.isNew) {
    return next(new Error('use AccountModel.persistIfVersionMatch for updating an account'));
  }
  return next();
});

AccountSchema.pre('update', (next) => {
  console.warn('DO NOT USE UPDATE METHOD DIRECTLY ON ACCOUNT MODEL, use AccountModel.persistIfVersionMatch');
  this.update({}, { $inc: { __version: 1 } }, next);
});

const AccountModel = mongoose.model('accounts', AccountSchema);
AccountModel.CurrencyTypeEnum = CurrencyTypeEnum;

AccountModel.persistIfVersionMatch = async (currentAccount, updatedFields) => {
  const currentVersion = currentAccount.__version;
  updatedFields.__version = currentVersion + 1;
  const writeResult = await AccountModel.findOneAndUpdate({
    _id: currentAccount._id,
    __version: currentVersion
  }, {
    $set: updatedFields
  }, {
    new: true
  });
  if (!writeResult) {
    console.log(`CONCURRENT_ACCESS for account: "${currentAccount._id}"`);
    const raceConditionError = new Error('Possible race condition while persisting action model (currentVersion: ' + currentVersion + ', newVersion: ' + currentAccount.__version);
    raceConditionError.name = 'ERR_CONCURRENT_ACCESS';
    throw raceConditionError;
  }
  return writeResult;
};


export default AccountModel;

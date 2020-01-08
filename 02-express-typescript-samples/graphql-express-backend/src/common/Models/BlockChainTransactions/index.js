import mongoose, {
  Schema
} from 'mongoose';

import BlockChainDetailsSchema from './BlockChainDetailsSchema';
import BlockChainTransactionTypeEnum from './enums/BlockChainTransactionTypeEnum';
import BlockChainTransactionStatusEnum from './enums/BlockChainTransactionStatusEnum';


const BlockChainTransactionSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    enum: BlockChainTransactionTypeEnum,
    required: true
  },
  status: {
    type: String,
    enum: BlockChainTransactionStatusEnum,
    required: true,
    default: BlockChainTransactionStatusEnum.PENDING
  },
  creditQuantity: {
    type: Number
  },
  debitQuantity: {
    type: Number
  },
  blockChainInfo: {
    type: BlockChainDetailsSchema
  }
}, {
  timestamps: true,
  versionKey: '__version'
});

BlockChainTransactionSchema.pre('save', (next) => {
  this.increment();
  return next();
});

BlockChainTransactionSchema.pre('update', (next) => {
  this.update({}, { $inc: { __version: 1 } }, next);
});

const BlockChainTransactionModel = mongoose.model('sessions', BlockChainTransactionSchema);

export default BlockChainTransactionModel;

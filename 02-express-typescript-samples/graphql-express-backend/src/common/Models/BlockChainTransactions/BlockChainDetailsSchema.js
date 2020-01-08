import {
  Schema
} from 'mongoose';

const BlockChainDetailsSchema = new Schema({
  fromAddress: {
    type: String,
    required: true
  },
  toAddress: {
    type: String,
    required: true
  },
  transactionAddress: {
    type: String,
  }
}, {
  _id: false
});

export default BlockChainDetailsSchema;

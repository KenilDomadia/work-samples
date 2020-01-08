import mongoose, {
  Schema
} from 'mongoose';
import CurrencyTypeEnum from '../../Enums/CurrencyTypeEnum';
import OrderStatusEnum from './enums/OrderStatusEnum';
import OrderTypeEnum from './enums/OrderTypeEnum';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(OrderTypeEnum),
    required: true
  },
  sourceCurrency: {
    type: String,
    enum: Object.values(CurrencyTypeEnum),
    required: true,
    default: CurrencyTypeEnum.FIAT
  },
  targetCurrency: {
    type: String,
    enum: Object.values(CurrencyTypeEnum),
    required: true,
    default: CurrencyTypeEnum.BTC
  },
  creditQuantity: {
    type: Number,
    required: true
  },
  debitQuantity: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  commissionRate: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: Object.values(OrderStatusEnum)
  }
}, {
  timestamps: true,
  versionKey: '__version',
});

OrderSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified('status')) {
    this.increment();
  } else if (!this.isNew) {
    return next(new Error('order fields except for status cannot be updated'));
  }
  return next();
});

OrderSchema.pre('validate', function (next) {
  // TODO : write logic to check minimum debit quantity
  return next();
});

OrderSchema.pre('update', next => next(new Error('you cannot use update on order model, use save method')));

const OrderModel = mongoose.model('orders', OrderSchema);
OrderModel.OrderTypeEnum = OrderTypeEnum;
OrderModel.OrderStatusEnum = OrderStatusEnum;

export default OrderModel;

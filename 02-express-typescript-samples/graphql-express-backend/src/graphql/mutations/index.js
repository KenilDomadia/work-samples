import Accounts from './Accounts';
import Orders from './Orders/';
import Users from './Users';

export default {
  ...Accounts,
  ...Orders,
  ...Users
};

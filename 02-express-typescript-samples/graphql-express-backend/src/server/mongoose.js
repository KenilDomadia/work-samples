import mongoose, {
  Types
} from 'mongoose';

global.MongoObjectId = Types.ObjectId;

global.MONGODB_URI = (process.env.NODE_ENV === 'LOCAL') ? process.env.MONGODB_LOCAL_URI : process.env.MONGODB_URI;

console.log('MONGODB_URI', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

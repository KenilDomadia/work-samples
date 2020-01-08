import * as express from 'express';
import validateToken from './validateAuthorizationHeader';
import * as cors from 'cors';

const app = express();

app.use(cors());
app.use(validateToken);
export default app;
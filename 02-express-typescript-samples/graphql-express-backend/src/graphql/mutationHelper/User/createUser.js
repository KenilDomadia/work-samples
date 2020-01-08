import {
  UserModel
} from '../../../common/Models/';

const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function createUser({
  birthDate,
  cell,
  cellVerified = false,
  country = 'India',
  countryCode = '+91',
  email,
  firstName,
  gender,
  lastName,
}) {
  const newUser = await UserModel.create({
    birthDate,
    cell,
    cellVerified,
    country,
    countryCode,
    email,
    firstName,
    gender,
    lastName,
    status: UserModel.UserStatusEnum.ACTIVE
  });
  return newUser;
}

export async function sendVerificationEmail({
  email,
  cell,
  _id
}) {
  const verificationToken = jwt.sign({
    email,
    cell,
    userId: _id.toString()
  }, process.env.JWT_SECRET, {
    expiresIn: 60 * 30
  });
  const verificationUrl = process.env.DOMAIN_URL + '/api/verifyEmail?verificationToken=' + verificationToken;
  console.log('verificationUrl', verificationUrl);
  if (process.env.NODE_ENV !== 'LOCAL') {
    const msg = {
      to: (process.env.NODE_ENV === 'DEV') ? 'kenildomadia@gmail.com' : email.toString(),
      from: 'no-reply@bitzoo.co.in',
      subject: 'Welcome to BitZoo: Verification Email',
      text: 'please verify your email by clicking on the following lonk',
      html: `<strong>${verificationUrl}</strong>`,
    };
    sgMail.send(msg);
  }
  return verificationToken;
}

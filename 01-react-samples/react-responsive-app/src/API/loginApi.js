import api from './api';

export async function userLoginAPI(userLoginData) {
  const response = await api('login', userLoginData);
  return response;
}

export async function mobileLoginAPI(loginData) {
  const response = await api('login_mobile', loginData);
  return response;
}

export async function verifyOTP(otpData) {
  const response = await api('verify-otp', otpData);
  return response;
}

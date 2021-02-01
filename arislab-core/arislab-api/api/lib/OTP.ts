export default class OTP {
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

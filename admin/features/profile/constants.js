const NAME_MIN = 3;
const NAME_MAX = 60;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 30;
// Errors constant name is created from:
// 1: uppercase input name + _ + (eg: NAME)
// 2: error type serverd by joi + _ + (eg: MIN)
// 3: ERROR
// 4: final constant name: NAME_MIN_ERROR

const NAME_MIN_ERROR = `Name length must be at least ${NAME_MIN} characters long`;
const NAME_MAX_ERROR = `Name length must be less than or equal to ${NAME_MAX} characters long`;
const USERNAME_EMAIL_ERROR = 'Email must be a valid email address';
const UPDATE_INFO_SUCCESS_MESSAGE = 'Profile successfully updated.';
const UPDATE_INFO_ERROR_MESSAGE = 'Could not save your account information';
const FETCH_INFO_ERROR_MESSAGE = 'Could not fetch your account information';
const PASSWORD_MAX_ERROR = `Password length must be less than or equal to ${PASSWORD_MAX} characters long`;
const PASSWORD_MIN_ERROR = `Password length must be at least ${PASSWORD_MIN} characters long`;

module.exports = {
  NAME_MIN,
  NAME_MAX,
  NAME_MIN_ERROR,
  NAME_MAX_ERROR,
  USERNAME_EMAIL_ERROR,
  UPDATE_INFO_SUCCESS_MESSAGE,
  UPDATE_INFO_ERROR_MESSAGE,
  FETCH_INFO_ERROR_MESSAGE,
  PASSWORD_MAX,
  PASSWORD_MIN,
  PASSWORD_MAX_ERROR,
  PASSWORD_MIN_ERROR
};

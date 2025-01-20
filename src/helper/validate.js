import toast from "react-hot-toast";
import { authenticate } from "../helper/helper";

export async function emailValidate(values) {
  const errors = emailVerify({}, values);

  if (values.email) {
    const { status } = await authenticate(values.email);

    if (status !== 200) {
      errors.exist = toast.error(
        "User with this email address doest not exist!"
      );
    }
  }

  return errors;
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirmPassword) {
    errors.exist = toast.error("Password do not match!");
    return errors;
  }
  return errors;
}

export async function registerValidation(values) {
  const errors = emailVerify({}, values);
  passwordVerify(errors, values);
  usernameVerify(errors, values);
  return errors;
}

export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

// validate password
function passwordVerify(error = {}, values) {
  const password = values.password;

  // Check if password is empty
  if (!password) {
    error.password = toast.error("Password is required!");
  }
  // Check if password contains spaces
  else if (/\s/.test(password)) {
    error.password = toast.error("Password cannot contain spaces!");
  }
  // Check password length (minimum 8 characters)
  else if (password.length < 8) {
    error.password = toast.error(
      "Password must be at least 8 characters long!"
    );
  }
  // Check for at least one uppercase letter
  else if (!/[A-Z]/.test(password)) {
    error.password = toast.error(
      "Password must contain at least one uppercase letter!"
    );
  }
  // Check for at least one number
  else if (!/[0-9]/.test(password)) {
    error.password = toast.error("Password must contain at least one number!");
  }
  // Check for at least one special character
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    error.password = toast.error(
      "Password must contain at least one special character!"
    );
  }

  return error;
}

// validate email
function emailVerify(error = {}, values) {
  // Check if email is empty
  if (!values.email) {
    error.email = toast.error("Email is required!");
  }
  // Check if email format is valid
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    error.email = toast.error("Invalid email address!");
  }

  return error;
}

function usernameVerify(error = {}, values) {
  const username = values.username;
  if (!username) {
    error.username = toast.error("user name cannot be empty");
  }
  if (username.length < 5) {
    error.username = toast.error("User name length must be more than 6");
  }
}

//validateResetPassword
// function

// export default emailVerify;

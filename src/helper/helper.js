import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// authenticate function
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (err) {
    return { error: "Username doesn't exist!" };
  }
}

export async function authenticate(email) {
  try {
    return await axios.post("/api/authenticate", { email });
  } catch (error) {
    return { error: "Email doesn't exist...!" };
  }
}

// register user
export async function registerUser(credentials) {
  try {
    const {
      data: { message },
      status,
    } = await axios.post("/api/register", credentials);
    let { username, email } = credentials;

    if (status === 201) {
      await axios.post("/api/registerMail", { username, email, text: message });
    }
    return message;
  } catch (err) {
    return err;
  }
}

export async function login({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });
      return data;
    }
  } catch (err) {
    return err;
  }
}

export async function updateUser({ response }) {
  try {
    const {
      data: { token },
    } = await axios.get("/api/getToken", {
      withCredentials: true, // Ensure the session cookie is included
    });
    const { data } = await axios.put("/api/updateUser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return err;
  }
}

export async function generateOTP() {
  try {
    const {
      data: { code, user },
      status,
    } = await axios.get("/api/generateOTP");
    if (status === 201) {
      const { username, email } = user;
      const text = `Dear ${username}, Your password recovery otp is ${code}.`;

      await axios.post("/api/registerMail", {
        username,
        email,
        text,
        subject: "Password recovery otp",
      });
    }
    return code;
  } catch (err) {
    return err;
  }
}

export async function verifyOTP({ code }) {
  try {
    const { status, data } = await axios.get("/verifyOTP", {
      params: { code },
    });

    if (status !== 200) {
      throw new Error(`Verification failed with status: ${status}`);
    }

    return data; // Returning data can give more context, like a success message or any other useful info
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return {
      success: false,
      message: err.message || "An error occurred while verifying the OTP.",
    };
  }
}

export async function resetPassword(password) {
  try {
    const { data, status } = await axios.put("/resetPassword", {
      password,
    });
    return { data, status };
  } catch (err) {
    return err;
  }
}

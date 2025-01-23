import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// authenticate function
export async function getUser({ email }) {
  try {
    const { data } = await axios.get(`/api/user/${email}`);
    // console.log("from frontend getUser funciton", { data });
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

export async function login({ email, password }) {
  try {
    if (email) {
      const { data } = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );
      if (data.success === false) {
        throw new Error(data.message); // Throw error if login failed (incorrect password or other issues)
      }
      console.log("this is from helper login", data);
      return data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
}

export async function updateUser(response) {
  try {
    console.log(response);
    const {
      data: { token },
    } = await axios.get("/api/getToken", {
      withCredentials: true,
    });

    console.log("This token is from updateUser frontend", token);
    const { data } = await axios.put(
      `/api/updateUser/${response.email}`,
      response,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(data);
    return data;
  } catch (err) {
    return err;
  }
}

export async function generateOTP(email) {
  try {
    const {
      data: { code, user },
      status,
    } = await axios.get(`/api/generateOTP/${email}`);
    console.log(code, user);
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
    const { status, data } = await axios.get(`/verifyOTP/${code}`);

    if (status !== 200) {
      throw new Error(`Verification failed with status: ${status}`);
    }
    return data;
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

export async function getUserEmailFromtoken() {
  try {
    const response = await axios.get("/api/getToken", {
      withCredentials: true,
    });
    const { token } = response.data;

    if (!token) {
      console.log("No token found");
      return Promise.reject("Cannot find Token");
    }

    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    return decoded;
  } catch (error) {
    console.error("Error getting token:", error);
    return null; // Handle any other errors (e.g., network issues)
  }
}

export async function logout() {
  const response = await axios.post("/api/logout", { withCredentials: true });
  if (response.status === 200) {
    console.log("Logout successful");
  } else {
    console.error("Logout failed");
  }
}

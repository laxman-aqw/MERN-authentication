import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import { registerUser } from "../helper/helper";

export const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Registered Succesfully</b>,
        error: <b>Could not register</b>,
      });
      registerPromise.then(function () {
        navigate("/");
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto mt-5 ">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-full">
        <div
          className={styles.glass}
          style={{ width: "45%", paddingTop: "3rem" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Please enter your email here
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt={avatar}
                  className={styles.profile_img}
                ></img>
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              ></input>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="laxman123"
                className={styles.textbox}
              ></input>
              <input
                {...formik.getFieldProps("email")}
                type="text"
                placeholder="john@gmail.com"
                className={styles.textbox}
              ></input>
              <input
                {...formik.getFieldProps("password")}
                type="text"
                placeholder="********"
                className={styles.textbox}
              ></input>
              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>

            <div className="text-center pt-4">
              <span className="text-gray-500">
                Already have an account? &nbsp;
                <Link className="text-red-500" to="/recovery">
                  Sign in.
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

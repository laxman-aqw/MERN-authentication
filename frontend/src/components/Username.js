import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { emailValidate } from "../helper/validate";
import { useAuthStore } from "../store/store";

export const Username = () => {
  const navigate = useNavigate();

  const setEmail = useAuthStore((state) => state.setEmail);
  useEffect(() => {});

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: emailValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values.email);
      setEmail(values.email);
      navigate("/password");
    },
  });
  return (
    <div className="container mx-auto mt-5 ">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-full">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <div className="profile flex justify-center py-4">
              {/* <img
                src={avatar}
                alt={avatar}
                className={styles.profile_img}
              ></img> */}
              <h1 className="text-3xl">Company logo</h1>
            </div>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Sign in with your email
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                type="text"
                placeholder="Email"
                className={styles.textbox}
              ></input>
              <button className={styles.btn} type="submit">
                Continue
              </button>
            </div>

            <div className="text-center pt-4">
              <span className="text-gray-500">
                Not a Member?&nbsp;
                <Link className="text-red-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

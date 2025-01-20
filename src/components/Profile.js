import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";

export const Profile = () => {
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      mobile: "",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      console.log(values);
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
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%", paddingTop: "3rem" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Update your required details here
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt={avatar}
                  className={`${styles.profile_img} ${extend.profile_img}`}
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
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  type="text"
                  placeholder="First Name"
                  className={`${styles.textbox} ${extend.textbox}  `}
                ></input>
                <input
                  {...formik.getFieldProps("lastName")}
                  type="text"
                  placeholder="Last Name"
                  className={`${styles.textbox} ${extend.textbox}  `}
                ></input>
              </div>
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  type="text"
                  placeholder="+977"
                  className={`${styles.textbox} ${extend.textbox}  `}
                ></input>
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  placeholder="Email"
                  className={`${styles.textbox} ${extend.textbox}  `}
                ></input>
              </div>
              <input
                {...formik.getFieldProps("address")}
                type="text"
                placeholder="Address"
                className={`${styles.textbox} ${extend.textbox}  `}
              ></input>

              <button className={styles.btn} type="submit">
                Save Changes
              </button>
            </div>

            <div className="text-center pt-4">
              <span className="text-gray-500">
                Logout? &nbsp;
                <Link className="text-red-500" to="/recovery">
                  Log out.
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

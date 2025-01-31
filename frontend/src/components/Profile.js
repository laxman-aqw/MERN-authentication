import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import useFetch from "../hooks/fetchHooks";
// import { useAuthStore } from "../store/store";
import { updateUser } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { logout } from "../helper/helper";

export const Profile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  // const { email } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch();
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.user.firstName || "",
      lastName: apiData?.user.lastName || "",
      email: apiData?.user.email || "",
      address: apiData?.user.address || "",
      mobile: apiData?.user.mobile || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // if (!apiData?.user) return;

      values = await Object.assign(values, {
        profile: file || apiData.user.profile || "",
      });
      console.log("these are the values", values);
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: "Updating your changes...",
        success: <b>Updated!</b>,
        error: <b>Could not update</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const logoutHandler = async () => {
    await logout();
    setFile(null); // Reset the uploaded file state
    formik.resetForm(); // Reset the form state
    navigate("/");
  };

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;

  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
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
                  src={file || apiData?.user.profile || avatar}
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
                <button onClick={logoutHandler} className="text-red-500" to="/">
                  Log out.
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

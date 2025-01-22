import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import useFetch from "../hooks/fetchHooks";
import { useAuthStore } from "../store/store";
import { login } from "../helper/helper";
export const Password = () => {
  const navigate = useNavigate();
  const { email } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${email}`);
  // console.log("email from password", email);
  // console.log("api data from password", apiData);
  // console.log(apiData);
  // console.log(serverError);
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    // validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values);
      try {
        let loginPromise = login({ email, password: values.password });
        console.log("this is loginPromise", loginPromise);
        toast.promise(loginPromise, {
          loading: "Checking password",
          success: <b>Logged in succesfully!</b>,
          error: <b>Incorrect password</b>,
        });
        const res = await loginPromise;
        navigate("/profile");
      } catch (err) {
        return err;
      }
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;

  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto mt-5 ">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-full">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Welcome back {apiData.user.username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500"></span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData.user.profile || avatar}
                alt={avatar}
                className={styles.profile_img}
              ></img>
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                type="text"
                placeholder="Password"
                className={styles.textbox}
              ></input>
              <button className={styles.btn} type="submit">
                Log In
              </button>
            </div>

            <div className="text-center pt-4">
              <span className="text-gray-500">
                Forgot Password? &nbsp;
                <Link className="text-red-500" to="/recovery">
                  Recover now.
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

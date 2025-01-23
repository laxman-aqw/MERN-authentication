// import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import styles from "../styles/Username.module.css";
import { generateOTP, verifyOTP } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Recovery = () => {
  const navigate = useNavigate();
  const { email } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  useEffect(() => {
    generateOTP(email).then((OTP) => {
      console.log(OTP);
      if (OTP) return toast.success("OTP has been sent to your gmail account!");
      return toast.error("Could not send OTP");
    });
  }, [email]);

  async function onSubmit(e) {
    e.preventDefault();
    let { status } = await verifyOTP({ OTP });
    if (status === 201) {
      toast.success("Verified Succesfully");
      return navigate("/reset");
    }
    return toast.error("Incorrect OTP");
  }

  function resentOTP() {
    let sendPromise = generateOTP(OTP);
    toast.promise(sendPromise, {
      loading: "Sending..",
      success: <b>OTP resend succesfully to your gmail</b>,
      error: <b>Cound not send OTP</b>,
    });
    sendPromise.then((OTP) => {
      console.log(OTP);
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>

          <form className="pt-20" onSubmit={onSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  onChange={(e) => setOTP(e.target.value)}
                  className={styles.textbox}
                  type="text"
                  placeholder="OTP"
                />
              </div>

              <button className={styles.btn} type="submit">
                Recover
              </button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP? <button className="text-red-500">Resend</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

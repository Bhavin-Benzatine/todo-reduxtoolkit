import React, { useState } from "react";
import { signupUser, signinUser } from "../reducers/authReducers";
import { useDispatch, useSelector } from "react-redux";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState("signin");
  const { loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const authenticat = () => {
    if (auth === "signin") {
      dispatch(signinUser({ email, password }));
    } else {
      dispatch(signupUser({ email, password }));
    }
  };

  return (
    <div>
      {loading && (
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      )}
      <h1>Please {auth}</h1>
      {error && <h5>{error}</h5>}
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="text"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      {auth === "signin" ? (
        <h6 onClick={() => setAuth("signUp")}>Dont have an account?</h6>
      ) : (
        <h6 onClick={() => setAuth("signin")}>Already have an account?</h6>
      )}
      <button
        className="btn"
        onClick={() => {
          authenticat();
        }}
      >
        {auth}
      </button>
    </div>
  );
};

export default Auth;

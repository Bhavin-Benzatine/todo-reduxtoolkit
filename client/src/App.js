import React, { useEffect } from "react";
import "./App.css";
import Auth from "./componts/Auth";
import Todo from "./componts/Todo";
import { useSelector, useDispatch } from "react-redux";
import { addToken } from "./reducers/authReducers";

function App() {
  const token = useSelector((state) => state.user.token);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addToken());
  }, []);

  return <div className="App">{token ? <Todo /> : <Auth />}</div>;
}

export default App;

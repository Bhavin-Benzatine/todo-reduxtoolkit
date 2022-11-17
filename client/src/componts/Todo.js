import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTodo, fetchTodo, deleteTodo } from "../reducers/todoReducers";
import { logout } from "../reducers/authReducers";

const Todo = () => {
  const [mytodo, setTodo] = useState("");

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos);

  const addTodo = () => {
    dispatch(createTodo({ todo: mytodo }));
    setTodo("");
  };

  useEffect(() => {
    dispatch(fetchTodo());
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="write todo here"
        value={mytodo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button className="btn" onClick={() => addTodo()}>
        Add todo
      </button>

      <ul className="collection">
        {todos.map((item) => {
          return (
            <li
              className="collection-item"
              key={item._id}
              onClick={() => dispatch(deleteTodo(item._id))}
            >
              {item.todo}
            </li>
          );
        })}
      </ul>

      <button className="btn" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
};

export default Todo;

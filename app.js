const express = require("express");
const app = express();
const PORT = 5000;
const mongoose = require("mongoose");

const User = require("./models/user");
const Todo = require("./models/todo");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, MONGOURI } = require("./config/keys");

app.use(express.json());
app.use(cors());

const requireLoging = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("you must be logged in.....");
  }
  try {
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    req.user = userId;
    next();
  } catch (err) {
    return res.status(401).send("you must be logged in");
  }
};

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("DB connected...");
  })
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).send("Please add all the fields..");
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send("user already exists with that email");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await new User({
      email,
      password: hashPassword,
    }).save();

    res.status(200).send(result);
  } catch (err) {
    console.log("err-->>", err);
  }
});

app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    if (!email || !password) {
      return res.status(422).send("Please add all the fields..");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("user not exists with that email");
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.status(200).send({ token });
    } else {
      return res.status(401).send("email or password mismatch");
    }
  } catch (err) {
    console.log("err==>>", err);
  }
});

app.post("/createtodo", requireLoging, async (req, res) => {
  const todo = req.body.todo;
  const todoBy = req.user;

  const result = await new Todo({
    todo,
    todoBy,
  }).save();

  res.status(200).json({ message: result });
});

app.get("/gettodo", requireLoging, async (req, res) => {
  const result = await Todo.find({ todoBy: req.user });
  res.status(200).json({ message: result });
});

app.delete("/remove/:id", requireLoging, async (req, res) => {
  const removeTodo = await Todo.findByIdAndDelete({ _id: req.params.id });
  res.status(200).json({ message: removeTodo });
});

if (process.env.NODE_ENV === "production") {
  const path = require("path");

  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

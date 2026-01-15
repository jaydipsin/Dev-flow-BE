import User from "../modals/user.modal.js";
import bcrypt from "bcrypt";

export const handleSignup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //   check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (userExists) {
      console.log(userExists);
      let message = null;
      userExists.email === email
        ? (message = "Email already in use")
        : (message = "Username already in use");
      return res.status(409).json({ message });
    }
    //   hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //   create new user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    //   if information is valid
    console.log("This is the saved user :", res.json(savedUser));

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during signup:", err);
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    //   check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });
    return res.status(200).json({ user, message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
  }
};

export const handleresetPassword = async (req, res) => {
  // TODO : 
};

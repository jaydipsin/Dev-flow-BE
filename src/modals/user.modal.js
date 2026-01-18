import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);
userSchema.set("toObject", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.refreshToken;
    return ret;
  },
});

const User = new mongoose.model("User", userSchema);

export default User;

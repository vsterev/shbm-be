import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
    // match: [/^[a-zA-Z ]{5,}$/, 'Name should contains minimum 5 english letters'],
  },
  email: {
    type: String,
    required: [true, "Please enter an email !"],
    unique: [true, "User/email already exists !"],
    // match: [
    //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    //   'Not valid email!',
    // ],
    // validate: [
    //   {
    //     validator: (v) => {
    //       // return /^[a-zA-Z0-9@.]{5,}$/.test(v);
    //       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //         v
    //       );
    //       return;
    //     },
    //     message: (props) => `${props.value} is not a valid email`,
    //   },
    // ],
  },
  password: {
    type: String,
    required: [true, "Please enter password!"],
    // match: [/^[a-zA-Z0-9]{5,}$/, 'Password should contains minimum 5 digits from numbers or letters'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, (this as unknown as IUser).password); // password verification in model
};
userSchema.pre("save", function (next) {
  //hash when saving password
  if (this.isModified("password")) {
    const saltGenerate = bcrypt.genSalt(9);
    saltGenerate
      .then((salt) => {
        const hash = bcrypt.hash((this as unknown as IUser).password, salt);
        Promise.all([salt, hash])
          .then(([, hash]) => {
            (this as unknown as IUser).password = hash;
            next();
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
    return;
  }
  next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // Ensure the update is of type `UpdateQuery`
    const update = this.getUpdate();

    // Check if the update is a standard UpdateQuery
    if (update && typeof update === "object" && "password" in update) {
      const password = (update as { password: string }).password;

      // Validate the password format
      if (!/^[a-zA-Z0-9]{5,}$/.test(password)) {
        throw new Error(
          "Password should contain a minimum of 5 characters, consisting only of numbers or letters.",
        );
      }

      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(9);
      const hash = await bcrypt.hash(password, salt);

      // Update the password field with the hashed value
      (update as { password: string }).password = hash;
    }

    next();
  } catch (err) {
    next(err as mongoose.CallbackError);
  }
});

export default mongoose.model<IUser>("User", userSchema);

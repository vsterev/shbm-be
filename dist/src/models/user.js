"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
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
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt_1.default.compare(password, this.password); // password verification in model
};
userSchema.pre("save", function (next) {
    //hash when saving password
    if (this.isModified("password")) {
        const saltGenerate = bcrypt_1.default.genSalt(9);
        saltGenerate
            .then((salt) => {
            const hash = bcrypt_1.default.hash(this.password, salt);
            Promise.all([salt, hash])
                .then(([, hash]) => {
                this.password = hash;
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
            const password = update.password;
            // Validate the password format
            if (!/^[a-zA-Z0-9]{5,}$/.test(password)) {
                throw new Error("Password should contain a minimum of 5 characters, consisting only of numbers or letters.");
            }
            // Generate salt and hash the password
            const salt = await bcrypt_1.default.genSalt(9);
            const hash = await bcrypt_1.default.hash(password, salt);
            // Update the password field with the hashed value
            update.password = hash;
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.js.map
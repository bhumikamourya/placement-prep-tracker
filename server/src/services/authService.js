const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const registerUser = async ({ name, email, password, targetRole }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("USER_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        targetRole,
    });

    return user;
};

const loginUser = async ({ email, password }) => {

    //check user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("INVALID_CREDENTIALS");
    }
    // TOKEN create karenge
    const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        token,
        user,
    };
};

module.exports = {
    registerUser,
    loginUser,
};

const jwt = require("jsonwebtoken");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const secret_key = process.env.JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ id }, secret_key, {
    expiresIn: "1h",
  });
};

module.exports = generateToken;

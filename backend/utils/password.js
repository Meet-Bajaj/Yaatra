const crypto = require("crypto");

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

const verifyPassword = (password, hashedPassword) => {
  if (!hashedPassword || !hashedPassword.includes(":")) {
    return false;
  }

  const [salt, hash] = hashedPassword.split(":");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derivedKey, "hex"));
};

module.exports = {
  hashPassword,
  verifyPassword,
};

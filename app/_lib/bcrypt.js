import bcrypt from "bcrypt";

const password = "jonas123";
const hash = await bcrypt.hash(password, 13);

// const salt = bcrypt.genSaltSync(10);
// console.log({ password, salt, hash });

console.log(hash);

const isMatch = await bcrypt.compare("jonas123", hash);
console.log(isMatch);

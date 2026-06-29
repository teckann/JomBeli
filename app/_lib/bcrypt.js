import bcrypt from "bcrypt";

export default async function hashValue(input) {
  const hash = await bcrypt.hash(input, 13);
  return hash;
}

// demo how to compare
// const isMatch = await bcrypt.compare("SDBL", hash);
// console.log(isMatch);

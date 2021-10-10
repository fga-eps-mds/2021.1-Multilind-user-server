import brcypt from "bcrypt";

export async function ecrypt(data) {
  const salt = await brcypt.genSalt(10);
  return brcypt.hash(data, salt);
}

export function validateData(dataToValidade, data) {
  return brcypt.compare(dataToValidade, data);
}

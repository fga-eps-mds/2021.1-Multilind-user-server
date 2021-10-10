import jwt from "jsonwebtoken";

export function createToken(payload, options) {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

export function validateToken(token) {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) resolve({ valid: false, payload: null });
      return resolve({ valid: true, payload });
    });
  });
}

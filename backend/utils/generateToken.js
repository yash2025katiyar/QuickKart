import jwt from "jsonwebtoken";

// Generates a signed JWT and sets it as an httpOnly cookie (XSS-safe storage)
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  const cookieDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS || 7);

  res.cookie("jwt", token, {
    httpOnly: true, // not accessible via client-side JS -> mitigates XSS token theft
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: cookieDays * 24 * 60 * 60 * 1000,
  });

  return token; // also returned in JSON body for clients that prefer Authorization header
};

export default generateToken;

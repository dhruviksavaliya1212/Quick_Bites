import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
  try {
    // Expect the token in the Authorization header
    const authHeader = req.headers.authorization;

    console.log("authseller", authHeader); // Debugging: Check what is received

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized! Please login." });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized! Please login." });
    }

    // Verify the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Attach seller ID to request body
    req.body.sellerId = token_decode.id;

    next();
  } catch (err) {
    console.log("JWT Verification Error:", err);
    res.status(401).json({ success: false, message: "Invalid token. Please login again." });
  }
};

export default authSeller;

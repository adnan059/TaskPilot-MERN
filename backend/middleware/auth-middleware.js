// import { createError } from "../libs/error.js";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     //console.log("auth middle token", authHeader);
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(createError(401, "Unauthorized"));
//     }

//     const token = authHeader.split(" ")[1];

//     let decoded;

//     try {
//       decoded = jwt.verify(token, process.env.JWT_SK);
//     } catch (error) {
//       return res.status(401).json({
//         message: "Unauthorized",
//         isInvalidToken: true,
//       });
//     }

//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return next(createError(401, "Unauthorized"));
//     }

//     req.user = user;
//     req.tokenPurpose = decoded.tokenPurpose;
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createError } from "../libs/error.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createError(401, "Unauthorized"));
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      // ✅ Normal verification (checks signature + expiry)
      decoded = jwt.verify(token, process.env.JWT_SK);
    } catch (error) {
      // 🔥 Token invalid or expired → decode ONLY to get metadata
      const decodedPayload = jwt.decode(token);

      if (!decodedPayload || typeof decodedPayload !== "object") {
        return next(createError(401, "Invalid token"));
      }

      return res.status(401).json({
        message: "Token expired or invalid",
        tokenPurpose: decodedPayload.tokenPurpose,
        isExpired: true,
      });
    }

    // ✅ Token is valid → now authenticate user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(createError(401, "Unauthorized"));
    }

    // ✅ Attach trusted data to request
    req.user = user;
    req.tokenPurpose = decoded.tokenPurpose;

    next();
  } catch (error) {
    next(error);
  }
};

import { sendVerificationEmail } from "../libs/verifyEmail.js";
import User from "../models/User.js";
import { createError } from "./../libs/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ------ register controller -------
export const registerUserCtrl = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    // gotta detect bot with arcjet

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(createError(400, "Email Address Already In Use"));
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    // gotta add purpose in the token payload and match it in the verifyCtrl
    const token = jwt.sign(
      { userId: newUser?._id, tokenPurpose: "emailVerification" },
      process.env.JWT_SK,
      {
        expiresIn: "2m",
      }
    );

    // send email
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    const html = `
      <div style="
        font-family: Arial, sans-serif; 
        background: #f4f4f5; 
        padding: 20px;
      ">
        <div style="
          max-width: 600px; 
          margin: auto; 
          background: white; 
          padding: 25px; 
          border-radius: 8px; 
          border: 1px solid #e5e7eb;
        ">
          <h2 style="margin: 0 0 15px; color: #111827;">
            Verify Your Email
          </h2>

          <p style="font-size: 14px; color: #374151; line-height: 1.5;">
            Thank you for registering on <strong>TaskPilot</strong>.
            To activate your account, please verify your email address by clicking the link below:
          </p>

          <a 
            href="${verificationLink}" 
            style="
              display: inline-block;
              margin: 20px 0;
              padding: 12px 18px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-size: 15px;
            "
          >
            Click here to verify your email
          </a>

          <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
            If the button above doesn’t work, copy and paste this link into your browser:
          </p>

          <p style="font-size: 13px; color: #2563eb; word-break: break-word;">
            ${verificationLink}
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            If you didn’t request this email, you can safely ignore it.<br>
            © ${new Date().getFullYear()} TaskPilot
          </p>
        </div>
      </div>
    `;
    sendVerificationEmail(html, email);

    res.status(201).json({
      message: "Registration Complete",
      data: newUser?._doc,
    });
  } catch (error) {
    next(error);
  }
};

// ------ login controller -------
export const loginUserCtrl = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(createError(404, "User Not Found"));
    }

    if (!user.isEmailVerified) {
      return next(
        createError(
          400,
          "Email is not verified. Please check your email for the verification link."
        )
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createError(400, "Wrong Credentials"));
    }

    const token = jwt.sign(
      { userId: user._id, tokenPurpose: "login" },
      process.env.JWT_SK,
      {
        expiresIn: "7d",
      }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = user._doc;
    delete userData.password;

    res.status(200).json({
      message: "Login Successful",
      token,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

// ------ verify email controller -------
export const verifyEmailCtrl = async (req, res, next) => {
  try {
    console.log("tokenPurpose", req.tokenPurpose);
    if (
      req.tokenPurpose !== "emailVerification" &&
      req.tokenPurpose !== "resetPassword"
    ) {
      return next(createError(401, "Unauthorized"));
    }

    const user = await User.findById(req.user?._id);
    user.isEmailVerified = true;
    await user.save();
    // console.log("verify ctrl: account verified");
    res.status(200).json({
      message: "Account Verified Successfully",
      tokenPurpose: req.tokenPurpose,
      success: true,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// ------ resend verfication link controller --------
export const resendVerificationLinkCtrl = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, "User does not exist"));
    }

    const token = jwt.sign(
      { userId: user?._id, tokenPurpose: "emailVerification" },
      process.env.JWT_SK,
      {
        expiresIn: "2m",
      }
    );

    //  send email
    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    const html = `
      <div style="
        font-family: Arial, sans-serif; 
        background: #f4f4f5; 
        padding: 20px;
      ">
        <div style="
          max-width: 600px; 
          margin: auto; 
          background: white; 
          padding: 25px; 
          border-radius: 8px; 
          border: 1px solid #e5e7eb;
        ">
          <h2 style="margin: 0 0 15px; color: #111827;">
            Verify Your Email
          </h2>

          <p style="font-size: 14px; color: #374151; line-height: 1.5;">
            Thank you for registering on <strong>TaskPilot</strong>.
            To activate your account, please verify your email address by clicking the link below:
          </p>

          <a 
            href="${verificationLink}" 
            style="
              display: inline-block;
              margin: 20px 0;
              padding: 12px 18px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-size: 15px;
            "
          >
            Click here to verify your email
          </a>

          <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
            If the button above doesn’t work, copy and paste this link into your browser:
          </p>

          <p style="font-size: 13px; color: #2563eb; word-break: break-word;">
            ${verificationLink}
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            If you didn’t request this email, you can safely ignore it.<br>
            © ${new Date().getFullYear()} TaskPilot
          </p>
        </div>
      </div>
    `;

    sendVerificationEmail(html, email);

    res.status(200).json({
      message: "Verification Link Has Been Sent",
    });
  } catch (error) {
    next(error);
  }
};

// ------ reset password request controller -------
export const resetPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(400, "User does not exist"));
    }

    const token = jwt.sign(
      { userId: user?._id, tokenPurpose: "resetPassword" },
      process.env.JWT_SK,
      { expiresIn: "2m" }
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

    const html = `
  <div style="
    font-family: Arial, sans-serif; 
    background: #f4f4f5; 
    padding: 20px;
  ">
    <div style="
      max-width: 600px; 
      margin: auto; 
      background: white; 
      padding: 25px; 
      border-radius: 8px; 
      border: 1px solid #e5e7eb;
    ">
      <h2 style="margin: 0 0 15px; color: #111827;">
        Reset Your Password
      </h2>

      <p style="font-size: 14px; color: #374151; line-height: 1.5;">
        We received a request to reset the password for your 
        <strong>TaskPilot</strong> account.
      </p>

      <p style="font-size: 14px; color: #374151; line-height: 1.5;">
        Click the button below to create a new password:
      </p>

      <a 
        href="${verificationLink}" 
        style="
          display: inline-block;
          margin: 20px 0;
          padding: 12px 18px;
          background: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 15px;
        "
      >
        Reset Password
      </a>

      <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
        This link will expire in <strong>15 minutes</strong>.
      </p>

      <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 13px; color: #2563eb; word-break: break-word;">
        ${verificationLink}
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        If you did not request a password reset, you can safely ignore this email.<br>
        Your password will remain unchanged.<br><br>
        © ${new Date().getFullYear()} TaskPilot
      </p>
    </div>
  </div>
`;

    sendVerificationEmail(html, email);
    res.status(200).json({
      message: "Verification Link Has Been Sent",
    });
  } catch (error) {
    next(error);
  }
};

// ------ reset password controller -------

export const resetPasswordCtrl = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "user does not exist"));
    }

    if (newPassword !== confirmPassword) {
      return next(createError(400, "Passwords dont match"));
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    next(error);
  }
};

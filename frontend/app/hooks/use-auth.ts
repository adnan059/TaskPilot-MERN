import { postData, updateData } from "@/lib/fetch-util";
import type { ForgotPasswordFormData } from "@/routes/auth/forgot-password";
import type { ResendVerificationLinkFormData } from "@/routes/auth/resendVerificationLink";
import type { ResetPasswordFormData } from "@/routes/auth/reset-password";
import type { SigninFormData } from "@/routes/auth/sign-in";
import type { SignUpFormData } from "@/routes/auth/sign-up";
import type { VerifyResponseType } from "@/routes/auth/verify";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMutation = () => {
  const signUpMutation = useMutation({
    mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
  });
  return signUpMutation;
};

export const useSignInMutation = () => {
  const signInMutation = useMutation({
    mutationFn: (data: SigninFormData) => postData("/auth/login", data),
  });
  return signInMutation;
};

export const useEmailVerificationMutation = () => {
  const emailVerificationMutation = useMutation<
    VerifyResponseType,
    Error,
    void
  >({
    mutationFn: () => postData<VerifyResponseType>("/auth/verify"),
  });
  return emailVerificationMutation;
};

export const useResendVerificationLinkMutation = () => {
  const resendVerificationLinkMutation = useMutation({
    mutationFn: (data: ResendVerificationLinkFormData) =>
      postData("/auth/resend-verification-link", data),
  });
  return resendVerificationLinkMutation;
};

export const useForgotPasswordMutation = () => {
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      postData("/auth/reset-password-request", data),
  });
  return forgotPasswordMutation;
};

export const useResetPasswordMutation = () => {
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData & { email: string }) =>
      updateData("/auth/reset-password", data),
  });

  return resetPasswordMutation;
};

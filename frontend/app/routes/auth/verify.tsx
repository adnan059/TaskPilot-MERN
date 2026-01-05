import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmailVerificationMutation } from "@/hooks/use-auth";
import { useAuth } from "@/provider/auth-context";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ResendVerificationLink from "./resendVerificationLink";
import { email } from "zod";

export type VerifyResponseType = {
  message: string;
  success: boolean;
  tokenPurpose: string;
  email: string;
};

const verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying ...");
  const { mutate } = useEmailVerificationMutation();
  const navigate = useNavigate();
  const [isExpired, setIsExpired] = useState(false);
  const [tokenPurpose, setTokenPurpose] = useState("");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    mutate(undefined, {
      onSuccess: (data) => {
        console.log("verify data ==>", data);
        setStatus(`✅ Verification Successful`);
        localStorage.removeItem("token");

        setTimeout(() => {
          navigate(
            data?.tokenPurpose === "resetPassword"
              ? "/reset-password"
              : "/sign-in",
            { state: { email: data.email } }
          );
        }, 2000);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Something Went Wrong";

        console.log(error);
        toast.error(errorMessage);
        setStatus("❌ Invalid or Expired Token : Verification Failed");
        setIsExpired(error.response?.data?.isExpired);
        setTokenPurpose(error.response?.data?.tokenPurpose);
      },
    });
  }, []);

  return (
    <div className="relative w-full  bg-blue-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
          {isExpired && tokenPurpose !== "resetPassword" && (
            <ResendVerificationLink />
          )}
        </div>
      </div>
    </div>
  );
};

export default verify;

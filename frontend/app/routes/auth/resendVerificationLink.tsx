import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResendVerificationLinkMutation } from "@/hooks/use-auth";
import { resendVerificationLinkSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

export type ResendVerificationLinkFormData = z.infer<
  typeof resendVerificationLinkSchema
>;

const ResendVerificationLink = () => {
  const form = useForm<ResendVerificationLinkFormData>({
    resolver: zodResolver(resendVerificationLinkSchema),
    defaultValues: {
      email: "",
    },
  });
  const navigate = useNavigate();

  const { mutate, isPending } = useResendVerificationLinkMutation();

  const onSubmit = (data: ResendVerificationLinkFormData) => {
    mutate(data, {
      onSuccess: (data: any) => {
        console.log(data);
        navigate("/verify-email");
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Something Went Wrong";
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="mt-8">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email Address</FormLabel> */}
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Your Email To Get Verification Link"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Resend Verification Link"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResendVerificationLink;

"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { signIn } from "next-auth/react";
export default function RegisterDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      className="flex justify-center items-center"
    >
      <div className="p-6 w-[400px] bg-white rounded-lg">
        <h2 className="text-2xl font-serif font-semibold text-center mb-6">
          Join Medium.
        </h2>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          className="!border-black !text-black !w-full !rounded-full !py-3 !mb-6"
          onClick={() => signIn("google")}
        >
          Sign up with Google
        </Button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <a href="/" className="text-green-600 font-medium hover:underline">
            Sign in
          </a>
        </p>
        <p className="text-xs text-center text-gray-500 mt-6">
          Click "Sign up" to agree to our
          <a href="/" className="underline">
            Terms of Service
          </a>
          and acknowledge that our
          <a href="/" className="underline">
            Privacy Policy
          </a>
          applies to you.
        </p>
      </div>
    </Dialog>
  );
}

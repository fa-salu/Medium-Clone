"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Google as GoogleIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { signIn, useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/hooks";
import { handleGoogleLogin } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  const dispatch = useAppDispatch();

  const { data: session } = useSession();

  React.useEffect(() => {
    if (session) {
      const userDetails = {
        name: session.user?.name || "",
        email: session.user?.email || "",
        imageUri: session.user?.image || "",
      };
      dispatch(handleGoogleLogin(userDetails)).then(() => {
        router.push("/u-home");
      });
    }
  }, [session, dispatch, router]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      PaperProps={{
        className:
          "flex justify-center items-center w-full sm:w-[400px] max-w-[400px] mx-auto", // Centering the content
      }}
    >
      <div className="relative p-6 w-full bg-white rounded-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-serif font-semibold text-center mb-6">
          Welcome back.
        </h2>
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          className="!border-black !text-black !w-full !rounded-full !py-3 !mb-6"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button>
        <span className="text-center text-sm text-gray-600">
          No account?
          <Link href="#" className="text-green-600 font-medium hover:underline">
            Create one
          </Link>
        </span>
        <span className="text-xs text-center text-gray-500 mt-6">
          Click &quot;Sign in&quot; to agree to our
          <span className="underline">Terms of Service</span>
          and acknowledge that our
          <span className="underline">Privacy Policy</span>
          applies to you.
        </span>
      </div>
    </Dialog>
  );
}

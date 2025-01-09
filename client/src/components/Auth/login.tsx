"use client";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
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
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      className="flex justify-center items-center"
    >
      <div className="p-6 w-[400px] bg-white rounded-lg">
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
        <p className="text-center text-sm text-gray-600">
          No account?
          <Link href="#" className="text-green-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
        <p className="text-xs text-center text-gray-500 mt-6">
          Click &quot;Sign in&quot; to agree to our
          <p className="underline">Terms of Service</p>
          and acknowledge that our
          <p className="underline">Privacy Policy</p>
          applies to you.
        </p>
      </div>
    </Dialog>
  );
}

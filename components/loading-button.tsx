import { Button } from "@/components/ui/button";
import React from "react";

const LoadingButton = ({
  pending,
  children,
  onClick,
}: {
  pending: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      className="w-full"
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8V4a4 4 0 00-4 4H0a8 8 0 018-8z"
            ></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;

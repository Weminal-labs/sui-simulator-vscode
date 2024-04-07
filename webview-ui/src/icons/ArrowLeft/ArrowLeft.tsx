import React from "react";

interface Props {
  className: any;
}

export const ArrowLeft = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5L9.66939 11.2191C9.2842 11.6684 9.2842 12.3316 9.66939 12.7809L15 19"
        stroke="#FEFEFE"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

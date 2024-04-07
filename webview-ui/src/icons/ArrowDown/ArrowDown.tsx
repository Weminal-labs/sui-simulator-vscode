import React from "react";

interface Props {
  className: any;
}

export const ArrowDown = ({ className }: Props): JSX.Element => {
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
        d="M5 9L11.2191 14.3306C11.6684 14.7158 12.3316 14.7158 12.7809 14.3306L19 9"
        stroke="#FEFEFE"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

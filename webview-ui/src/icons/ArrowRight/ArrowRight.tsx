import React from "react";

interface Props {
  className: any;
}

export const ArrowRight = ({ className }: Props): JSX.Element => {
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
        d="M9 19L14.3306 12.7809C14.7158 12.3316 14.7158 11.6684 14.3306 11.2191L9 5"
        stroke="#FEFEFE"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

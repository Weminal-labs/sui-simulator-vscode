import React from "react";

interface Props {
  className: any;
}

export const ArrowUp = ({ className }: Props): JSX.Element => {
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
        d="M19 15L12.7809 9.66939C12.3316 9.2842 11.6684 9.2842 11.2191 9.66939L5 15"
        stroke="#FEFEFE"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

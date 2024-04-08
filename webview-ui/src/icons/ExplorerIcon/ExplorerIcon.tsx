import React from "react";

interface Props {
  className: any;
}

export const ExplorerIcon = ({ className }: Props): JSX.Element => {
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
        d="M10.18 9.32001C9.35999 8.19001 8.05001 7.45001 6.54001 7.45001C4.03001 7.45001 1.98999 9.49 1.98999 12C1.98999 14.51 4.03001 16.55 6.54001 16.55C8.23001 16.55 9.80001 15.66 10.67 14.21L12 12L13.32 9.78998C14.19 8.33998 15.76 7.45001 17.45 7.45001C19.96 7.45001 22 9.49 22 12C22 14.51 19.96 16.55 17.45 16.55C15.95 16.55 14.64 15.81 13.81 14.68"
        stroke="#00FFE0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};
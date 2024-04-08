import React from "react";

interface Props {
  className: any;
}

export const EnvironmentIcon = ({ className }: Props): JSX.Element => {
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
        d="M3.16998 7.44L12 12.55L20.77 7.47"
        stroke="#1400FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path d="M12 21.61V12.54" stroke="#1400FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path
        d="M9.93001 2.48001L4.59001 5.44001C3.38001 6.11001 2.39001 7.79001 2.39001 9.17001V14.82C2.39001 16.2 3.38001 17.88 4.59001 18.55L9.93001 21.52C11.07 22.15 12.94 22.15 14.08 21.52L19.42 18.55C20.63 17.88 21.62 16.2 21.62 14.82V9.17001C21.62 7.79001 20.63 6.11001 19.42 5.44001L14.08 2.47001C12.93 1.84001 11.07 1.84001 9.93001 2.48001Z"
        stroke="#1400FF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

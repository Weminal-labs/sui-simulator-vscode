import React from "react";

interface Props {
  handleClick: () => void;
}

export const CopyIcon = ({ handleClick }: Props): JSX.Element => {
  return (
    <button onClick={handleClick}>
      <img
        width="24"
        height="24"
        src="https://img.icons8.com/fluency-systems-regular/48/FFFFFF/copy--v1.png"
        alt="copy--v1"
      />
    </button>
  );
};

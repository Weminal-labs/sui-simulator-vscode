import React from "react";

interface Props {
  status: "hover" | "active" | "default";
  className: any;
  labelClassName: any;
  text: string;
}

export const Label = ({ status, className, labelClassName, text = "LABEL" }: Props): JSX.Element => {
  return (
    <div
      className={`inline-flex items-center gap-[4px] pt-[7px] pb-[9px] px-[16px] rounded-[32px] relative ${
        status === "default" ? "[-webkit-backdrop-filter:blur(120px)_brightness(100%)]" : ""
      } ${status === "hover" ? "bg-[#6f6f6f66]" : status === "active" ? "bg-white-100" : ""} ${
        status === "default" ? "backdrop-blur-[120px] backdrop-brightness-[100%]" : ""
      } ${className}`}
    >
      <div
        className={`font-common-caption w-fit mt-[-1.00px] tracking-[var(--common-caption-letter-spacing)] text-[length:var(--common-caption-font-size)] [font-style:var(--common-caption-font-style)] relative font-[number:var(--common-caption-font-weight)] whitespace-nowrap leading-[var(--common-caption-line-height)] ${
          status === "active" ? "text-black-100" : "text-white-100"
        } ${labelClassName}`}
      >
        {text}
      </div>
    </div>
  );
};
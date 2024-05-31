import React from "react";

interface Props {
    className?: string;
}

export const Logo = ({ className }: Props) => {
    return (
        <svg
            className={className}
            width="179"
            height="176"
            viewBox="0 0 179 176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="89.5" cy="88" rx="89.5" ry="88" fill="url(#paint0_radial_2142_56)" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M85.3405 85.6312C110.304 62.3388 118.945 31.4416 104.641 16.6204C90.3362 1.79919 58.5032 8.66646 33.5395 31.9589C8.57588 55.2513 -0.065115 86.1485 14.2393 100.97C28.5438 115.791 60.3768 108.924 85.3405 85.6312ZM144.916 142.958C169.88 119.666 178.521 88.7686 164.216 73.9474C149.912 59.1262 118.079 65.9935 93.115 89.2859C68.1513 112.578 59.5103 143.476 73.8148 158.297C88.1192 173.118 119.952 166.251 144.916 142.958Z"
                fill="url(#paint1_radial_2142_56)"
            />
            <defs>
                <radialGradient
                    id="paint0_radial_2142_56"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(31.5 22) rotate(47.1893) scale(175.844 178.842)">
                    <stop stopColor="#00009C" />
                    <stop offset="1" stopColor="#00C2DD" />
                </radialGradient>
                <radialGradient
                    id="paint1_radial_2142_56"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(89 93.2889) rotate(90) scale(72.7111 77.0397)">
                    <stop />
                    <stop offset="1" stopColor="#253E55" />
                </radialGradient>
            </defs>
        </svg>
    );
};

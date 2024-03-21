import React from 'react';

export interface IButtonProps {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}

export const Button = ({ onClick, children }: IButtonProps) => {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    );
};
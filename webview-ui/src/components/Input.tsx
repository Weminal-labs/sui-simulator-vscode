import React from 'react';

export interface IInputProps {
    placeholder: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ placeholder, value, onChange }: IInputProps) => {
    return (
        <input type="text" placeholder={placeholder} value={value} onChange={onChange} />
    );
};

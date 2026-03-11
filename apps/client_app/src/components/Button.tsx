import { ButtonHTMLAttributes, FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const base = "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  };
  
  return <button className={twMerge(base, variants[variant], className)} {...props} />;
};
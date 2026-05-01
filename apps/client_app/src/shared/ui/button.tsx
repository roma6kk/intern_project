import { ButtonHTMLAttributes, FC } from 'react';
import { cn } from '@/shared/lib/cn';
import btn from '@/shared/styles/button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
}

const variantClass: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: btn.primary,
  secondary: btn.secondary,
  ghost: btn.ghost,
  danger: btn.danger,
  icon: btn.icon,
};

export const Button: FC<ButtonProps> = ({ className, variant = 'primary', type = 'button', ...props }) => {
  return <button type={type} className={cn(variantClass[variant], className)} {...props} />;
};

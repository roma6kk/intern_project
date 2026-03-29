import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';
import forms from '@/shared/styles/forms.module.css';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn(forms.input, className)} {...props} />;
  }
);
Input.displayName = 'Input';

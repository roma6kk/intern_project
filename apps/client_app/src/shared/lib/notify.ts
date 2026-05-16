import { toast, type ToastContent, type ToastOptions } from 'react-toastify';

type NotifyOptions = ToastOptions;

const baseOptions: NotifyOptions = {
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

function mergeOptions(options?: NotifyOptions): NotifyOptions {
  return options ? { ...baseOptions, ...options } : baseOptions;
}

export const notify = {
  show: (content: ToastContent, options?: NotifyOptions) => toast(content, mergeOptions(options)),
  success: (message: string, options?: NotifyOptions) => toast.success(message, mergeOptions(options)),
  error: (message: string, options?: NotifyOptions) => toast.error(message, mergeOptions(options)),
  info: (message: string, options?: NotifyOptions) => toast.info(message, mergeOptions(options)),
  warning: (message: string, options?: NotifyOptions) => toast.warning(message, mergeOptions(options)),
  dismiss: (id?: string | number) => toast.dismiss(id),
};


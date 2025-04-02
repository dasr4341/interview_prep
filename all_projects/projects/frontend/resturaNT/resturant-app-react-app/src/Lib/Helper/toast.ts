import { toast } from 'react-toastify';

export default function Toast(message: string, success: boolean) {
  if (success && message !== '') {
    toast.success(message);
  } else if (!success && message !== '') {
    toast.error(message);
  }
}

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
export function toastNetworkError(e: any | AxiosError) {
  if (e instanceof AxiosError) {
    toast.error(e.response?.data.error || '');
  } else {
    toast.error(e.message);
  }
}

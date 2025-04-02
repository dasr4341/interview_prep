export interface IModal {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  open: boolean;
  loading?: boolean;
  onBlur?: () => void;
}

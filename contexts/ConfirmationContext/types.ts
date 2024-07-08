export interface IConfirmationContext {
  showConfirmationPopup: (
    onConfirm: () => void,
    text?: string,
  ) => (e: React.MouseEvent) => void;
}

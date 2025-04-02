import loader from 'assets/images/loading_icon.gif';

export function FullScreenLoadingIndicator(): JSX.Element {
  return (
    <div
      className="flex flex-col h-screen items-center justify-center fixed left-0 right-0"
      style={{ zIndex: 3000 }}>
      <img src={loader} alt="loading..." width={30} height={30} className="mb-5" />
    </div>
  );
}

import loader from 'assets/images/loading_icon.gif';

export function LoadingIndicator(): JSX.Element {
  return <div className="flex flex-col h-screen items-center justify-center">
  <img src={loader} alt="loading..." width={30} height={30} className="mb-5" />
</div>;
}

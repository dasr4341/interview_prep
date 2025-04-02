export function ErrorMessage({ message, testId }: { message: string; testId?: string }): JSX.Element {
  return (
    <>
      {message && (
        <div className="bg-orange text-white p-2 text-base mt-2 mb-3"
        data-testid={testId ? testId : 'error-id'}>
          {message}
        </div>
      )}
    </>
  );
}

export function FadeOverlay(): JSX.Element {
  return (
    <div
      className="bg-black absolute top-0 right-0 
        bottom-0 w-32 pointer-events-none md:hidden"
      style={{
        background:
          // eslint-disable-next-line max-len
          'linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))',
      }}
    />
  );
}

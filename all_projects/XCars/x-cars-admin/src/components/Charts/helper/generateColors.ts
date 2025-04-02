import { useMemo } from 'react';
export function useGenerateColors(n: number) {
  return useMemo(() => {
    const colors = [];
    for (let i = 0; i < n; i++) {
      const hue = (i * 360) / n;
      const color = `hsl(${hue}, 100%, 50%)`;
      colors.push(color);
    }
    return colors;
  }, [n]);
}

export const math_helper = {
  mean: (arr: number[]) => {
    return arr.reduce((acc, curr) => acc + curr, 0) / Math.max(1, arr.length);
  },

  population_sd: (arr: number[]) => {
    const mean = math_helper.mean(arr);
    const deviation = arr.map((e) => Math.pow(e - mean, 2));
    const variance = math_helper.mean(deviation);

    return Number(Math.sqrt(variance).toFixed(5));
  },

  sample_sd: (arr: number[]) => {
    const mean = math_helper.mean(arr);
    const deviation = arr.map((e) => Math.pow(e - mean, 2));
    const variance = deviation.reduce((acc, curr) => acc + curr, 0) / Math.max(1, arr.length - 1);

    return Number(Math.sqrt(variance).toFixed(5));
  },

  point_zscore: (value: number, mean: number, sd: number) => {
    return (value - mean) / sd;
  },
};

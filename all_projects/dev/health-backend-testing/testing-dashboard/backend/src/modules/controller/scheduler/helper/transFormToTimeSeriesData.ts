export function transFormToTimeSeriesData(schedulerData: any) {
    return Object.entries(schedulerData).reduce(
      (prevState: { value: string; label: string }[], currentState) => {
        const [key, arr] = currentState;
        const modifiedArr = (arr as any).map((m: any) => ({
          value: m,
          label: key,
        }));
        return [...prevState, ...modifiedArr];
      },
      []
    );
  
  }
import { SemiCircleProgress } from '@mantine/core';
const SemiCircleProgressBar = ({
  totalCars,
  soldCars,
}: {
  totalCars: number;
  soldCars: number;
}) => {
  const percentage = totalCars ? (soldCars / totalCars) * 100 : 0;
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold text-gray-700 self-start">Sold Cars</h3>
      <SemiCircleProgress
        filledSegmentColor={'violet'}
        className="w-full"
        size={300}
        thickness={16}
        value={percentage}
        labelPosition="center"
        label={<Label soldCars={soldCars} totalCars={totalCars} />}
      />
    </div>
  );
};

export default SemiCircleProgressBar;

const Label = ({
  soldCars,
  totalCars,
}: {
  soldCars: number;
  totalCars: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-between">
      <h3 className="text-4xl font-bold text-purple-700">{soldCars}</h3>
      <span className="text-sm text-gray-400">sold out of</span>
      <span className="text-sm font-semibold text-gray-500">{totalCars}</span>
    </div>
  );
};

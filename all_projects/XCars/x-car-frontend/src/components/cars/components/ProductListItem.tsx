import React from 'react';

const ProductListItem = ({ item }: { item: string }) => {
  return (
    <div className="flex flex-row items-start gap-2 ">
      <div className=" w-3 h-3 rounded-full bg-green-600 mt-1"></div>
      <div className=" flex-1 text-gray-800 font-light text-sm">{item}</div>
    </div>
  );
};

export default ProductListItem;

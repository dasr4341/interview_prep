import React from 'react';
import Humanize from 'humanize-plus';

export default function CurrencyFormat({ price }: { price: number }) {
  return (
    <>
      $ {Humanize.formatNumber(price, 2)}
    </>
  );
}

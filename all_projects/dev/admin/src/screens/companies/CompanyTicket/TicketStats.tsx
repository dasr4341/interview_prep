import React from 'react';
import Humanize from 'humanize-plus';


export default function TicketStats({ overallDaysOpen, avgDaysOpen, title }: { avgDaysOpen: number; overallDaysOpen: number, title: string }) {
  return (
    <>
      <p className={`${overallDaysOpen >= avgDaysOpen ? 'text-green' : 'text-orange'}  font-bold text-xs`}>
        {overallDaysOpen > avgDaysOpen && 'Below Normal'}
        {overallDaysOpen < avgDaysOpen && 'Above Normal'}
        {overallDaysOpen == avgDaysOpen && 'Normal'}
      </p>
      <p
        className={`${
          overallDaysOpen >= avgDaysOpen ? 'text-green' : 'text-orange'
        } font-bold text-md`}>
        {Humanize.formatNumber(overallDaysOpen, 2)}{' '}
        <span className="text-gray-600 font-medium text-xxs">(Avg. {Humanize.formatNumber(avgDaysOpen, 2)})</span>
      </p>
      <p className="text-gray-600 font-medium text-xxs mt-1">{title}</p>
    </>
  );
}

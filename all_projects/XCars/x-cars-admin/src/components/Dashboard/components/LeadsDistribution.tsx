import { LeadsCount } from '@/generated/graphql';
import React from 'react';

const LeadsDistribution = ({
  leads,
  loading,
}: {
  leads: LeadsCount | undefined;
  loading: boolean;
}) => {
  if (!leads && loading)
    return <div className="animate-pulse w-full h-24 bg-gray-200"></div>;
  else if (!leads) return <div className="">No Leads found</div>;
  const hotAssigned =
    leads.totalHotAssignedLeads + leads.totalColdAssignedLeads
      ? (leads.totalHotAssignedLeads /
          (leads.totalHotAssignedLeads + leads.totalColdAssignedLeads)) *
        100
      : 0;
  const hotUnassigned =
    leads.totalHotUnassignedLeads + leads.totalColdUnassignedLeads
      ? (leads.totalHotUnassignedLeads /
          (leads.totalHotUnassignedLeads + leads.totalColdUnassignedLeads)) *
        100
      : 0;
  return (
    <div>
      <h3 className="font-bold text-gray-700 mb-1">Leads</h3>
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium text-gray-600">
          Assigned Leads
        </span>
        <span className="text-xs font-light text-gray-400">
          {leads.totalHotAssignedLeads} Hot Leads out of{' '}
          {leads.totalHotAssignedLeads + leads.totalColdAssignedLeads}
        </span>
        <div className="flex items-center w-full mt-2">
          <Tooltip
            message={`Hot Leads: ${leads.totalHotAssignedLeads}`}
            widthPercent={hotAssigned}
            className="bg-purple-600 h-2 rounded-s-full"
          />
          <Tooltip
            message={`Normal Leads: ${leads.totalColdAssignedLeads}`}
            widthPercent={100 - hotAssigned}
            className="bg-purple-300 h-2 rounded-e-full"
          />
        </div>
      </div>
      <div className="flex flex-col items-start mt-3">
        <span className="text-sm font-medium text-gray-600">
          Unassigned Leads
        </span>
        <span className="text-xs font-light text-gray-400">
          {leads.totalHotUnassignedLeads} Hot Leads out of{' '}
          {leads.totalHotUnassignedLeads + leads.totalColdUnassignedLeads}
        </span>
        <div className="flex items-center w-full mt-2">
          <Tooltip
            message={`Hot Leads: ${leads.totalHotUnassignedLeads}`}
            widthPercent={hotUnassigned}
            className="bg-green-600 h-2 rounded-s-full"
          />
          <Tooltip
            message={`Normal Leads: ${leads.totalColdUnassignedLeads}`}
            widthPercent={100 - hotUnassigned}
            className="bg-green-300 h-2 rounded-e-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LeadsDistribution;

function Tooltip({
  message,
  widthPercent,
  className,
}: {
  message: string;
  widthPercent: number;
  className: string;
}) {
  return (
    <div
      className={`group relative flex ${className}`}
      style={{ width: `${widthPercent}%` }}
    >
      <span className="absolute top-4 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {message}
      </span>
    </div>
  );
}

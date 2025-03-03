"use client";
import React, { useState } from "react";
import { TiTick } from "react-icons/ti";

interface IRoadMap {
  title: string;
  description: string;
  isCompleted: boolean;
}

const data = [
  {
    title: "Introduction Python",
    description: "Complete Tutorial : Learn Data python from scratch",
    isCompleted: false,
  },
  {
    title: "Introduction Python",
    description: "Complete Tutorial : Learn Data python from scratch",
    isCompleted: false,
  },
  {
    title: "Introduction Python",
    description: "Complete Tutorial : Learn Data python from scratch",
    isCompleted: false,
  },
  {
    title: "Introduction Python",
    description: "Complete Tutorial : Learn Data python from scratch",
    isCompleted: false,
  },
  {
    title: "Introduction Python",
    description: "Complete Tutorial : Learn Data python from scratch",
    isCompleted: false,
  },
];

const RoadMapCard = ({ title, description, isCompleted }: IRoadMap) => {
  const [showBadge, SetShowBadge] = useState(false);
  
  return (
    <div className="card">
      <div className="avatar" onClick={() => SetShowBadge((p) => !p)}>
        <div className="icon">
          {showBadge && <div className=" pointer"></div>}
        </div>
      </div>
      <div className="info">
        <div className="info-header">
          <div className="info-badge">{title} </div>
          <div className="info-icon">
            <TiTick color={isCompleted ? "green" : "yellow"} size={20} />
          </div>
        </div>
        <div className="info-details">{description}</div>
      </div>
    </div>
  );
};

function RoadMap() {
  const [roadMap] = useState(data);

  return (
    <section className="road-map-card-grp">
      {roadMap.map((e, i) => (
        <RoadMapCard key={i} {...e} />
      ))}
      x
    </section>
  );
}

export default RoadMap;

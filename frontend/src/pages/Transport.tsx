import React from "react";
import { Icons } from "../constants/styles/icons";
import type { TransportProps } from '../types/index';
import { bestValueTransport } from "../utils/helper";


export const TransportList = ({
  transportOptions,
  selectedCard,
  setSelectedCard,
  busData,
  trainData,
  uberPrice,
  budget,
  bikeMinutes,
  bikeCost,
}: TransportProps ) => {

  bestValueTransport(transportOptions);
  return (
    <div className="transport-list">
      <div className="rides-header">Based on your budget - Vehicle</div>


      {transportOptions.map((t) => {
        const isBus = t.id === "bus";
        const isTrain = t.id === "train";
        const isUber = t.id === "uber";
        const isBike = t.id === "bike";

        const price =
          isBus && busData
            ? `$${busData.fare.toFixed(2)}`
            : isTrain && trainData
            ? `$${trainData.fare.toFixed(2)}`
            : isUber && uberPrice
            ? `$${uberPrice}`
            : isBike && bikeCost
            ? `${bikeCost}`
            : t.price;

        const time =
          isBus && busData
            ? busData.durationSeconds
            : isTrain && trainData
            ? trainData.duration
            : isUber
            ? "Arrives in ~12 mins"
            : isBike && bikeMinutes
            ? bikeMinutes
            : t.time;

        const sub =
          isBus && busData && busData.busNames.length > 0
            ? `Lines: ${busData.busNames.join(", ")}`
            : isTrain && trainData && trainData.trainNames.length > 0
            ? `Lines: ${trainData.trainNames.join(", ")}`
            : isUber
            ? "Door to door"
            : t.sub;

        const numericPrice = Number(price.replace("$", "") || 0);

        return (
          <div
            key={t.id}
            className={`transport-card ${
              selectedCard === t.id ? "best" : ""
            }`}
            onClick={() => setSelectedCard(t.id)}
          >
            <div className="tc-left">
              <div className="tc-icon">
                <t.Icon />
              </div>

              <div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-sub">{sub}</div>
              </div>
            </div>

            <div className="tc-right">
              <div className="tc-price">{price}</div>
              <div className="tc-time">{time}</div>

              {numericPrice > budget && (
                <div className="over-budget">Over budget</div>
              )}

              {selectedCard === t.id && (
                <div className="best-badge">
                  {t.best ? "Best value" : "Selected"}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
import type { TransportProps } from "../../types/index";
import { bestValueTransport } from "../../utils/helper";

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
}: TransportProps) => {

  // Build updated transport list with real-time prices
  const updatedTransportOptions = transportOptions.map((t) => {
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
        ? `$${bikeCost}`
        : t.price;

    return {
      ...t,
      price,
    };
  });

  const bestOption = bestValueTransport(updatedTransportOptions, budget);

  return (
    <div className="transport-list">
      <div className="rides-header">
        Based on your budget - Vehicle
      </div>

      {updatedTransportOptions.map((t) => {
        const isBus = t.id === "bus";
        const isTrain = t.id === "train";
        const isUber = t.id === "uber";
        const isBike = t.id === "bike";

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
            : isTrain &&
              trainData &&
              trainData.trainNames.length > 0
            ? `Lines: ${trainData.trainNames.join(", ")}`
            : isUber
            ? "Door to door"
            : t.sub;

        const numericPrice = Number(
          t.price.replace("$", "") || 0
        );

        const isBestValue = bestOption?.id === t.id;

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
              <div className="tc-price">{t.price}</div>
              <div className="tc-time">{time}</div>

              {numericPrice > budget && (
                <div className="over-budget">
                  Over budget
                </div>
              )}

              {isBestValue && (
                <div className="best-badge">
                  Best Value
                </div>
              )}

              {selectedCard === t.id && !isBestValue && (
                <div className="best-badge">
                  Selected
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
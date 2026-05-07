import { Icons } from '../../constants/styles/icons';
import { TransportList } from '../../pages/Transport';
import type { TransportOption, TransportProps } from '../../types';


export const formatedDuration = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${
      hours > 0 ? `${hours} hr` : ""
    }`.trim();
  }

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes} min`;
  };

  export const transportOptions = [
    { id: "bike", Icon: Icons.Bike, name: "E-Bike / Scooter", sub: "Rental available", price: "$", time: "" },

    { id: "uber", Icon: Icons.Car, name: "Uber / Rideshare", sub: "Door to door", price: `$`, time: "Arrives in: 12 mins" },
    { id: "bus", Icon: Icons.Bus, name: "City Bus", sub: "", price: "$", time: ""},
    { id: "train", Icon: Icons.Train, name: "Train", sub: "Direct line", price: "$", time: ""  },
  ];

export const bestValueTransport = (TransportList: TransportOption[]) => {

  for (const transport of TransportList) {
    const prices = transportOptions.map((option) => Number(option.price.replace("$", "")) || 0);
    const time = transport.time;
    const totalCost = Number(transport.price.replace("$", "")) || 0;
    console.log("Prices:", transport.price);
  }
  
}

export const tripMessage = (trip: any): string => {
  return `
🚗 Trip Summary

📍 From: ${trip.from}
📍 To: ${trip.to}

💰 Budget: $${trip.budget}

🚴 Transport: ${trip.selectedTransport}
⏱️ Estimated Duration: ${trip.duration}
📏 Distance: ${trip.distance}

🚌 Bus Option:
   Price: $${trip.bus?.price}
   Duration: ${trip.bus?.duration}

🚕 Uber Option:
   Price: $${trip.uber?.price}

Arrival Speed Preference: ${trip.arrivalSpeed}

Have a safe trip! 
  `.trim();
};
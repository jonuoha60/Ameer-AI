import { Icons } from '../../constants/styles/icons';
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
    { id: "bike", Icon: Icons.Bike, name: "E-Bike / Scooter", sub: "Rental available", price: "", time: "", best: false },

    { id: "uber", Icon: Icons.Car, name: "Uber / Rideshare", sub: "Door to door", price: ``, time: "Arrives in: 12 mins", best: false },
    { id: "bus", Icon: Icons.Bus, name: "City Bus", sub: "", price: "", time: "", best: false },
    { id: "train", Icon: Icons.Train, name: "Train", sub: "Direct line", price: "", time: "", best: false },
  ];

export const bestValueTransport = (TransportList: TransportOption[], budget: number): TransportOption | null => {

  let bestOption: TransportOption | null = null;

  console.log("Budget:", budget);
  console.log("Transport List:", TransportList);


  for (const option of TransportList) {
    const price = Number(option.price.replace("$", "") || 0);
    console.log(`Evaluating ${option.name} with price ${price}`); 
    if (price <= budget && price < (bestOption ? Number(bestOption.price.replace("$", "") || 0) : Infinity)) {
    bestOption = option;
    }
    console.log(`bestOption is now: ${bestOption?.name || "None"}`);
  }

  return bestOption
  
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
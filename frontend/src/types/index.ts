export interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  placeholder: string;
  type: string;
  value: string;
  callFunc: React.Dispatch<React.SetStateAction<string>>;
  onBlur: () => void
}

export type GeoLocationPosition = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
};

export interface BusData {
  busCount: number;
  busNames: string[];
  durationSeconds: string;
  fare: number;
}

export interface TrainData {
  trainCount: number;
  trainNames: string[];
  duration: string;
  fare: number;
}

export interface TransportOption {
  id: string;
  Icon: any;
  name: string;
  sub: string;
  price: string;
  time: string;
  best?: boolean;
}

export interface TransportProps {
  transportOptions: TransportOption[];
  selectedCard: string | null;
  setSelectedCard: (id: string) => void;
  busData: BusData | null;
  trainData: TrainData | null;
  uberPrice: string;
  budget: number;
  bikeMinutes: string;
  bikeCost: string | undefined;
}



export interface Auth {
    id: string;
    email: string;
    username: string;
    accessToken: string;
    profilePic?: string;
    createdAt: string;
    
}

export interface AuthContextType {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<{}>>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  loginUser: (auth: Auth) => void; 


}

export interface UserAuthProvider {
  children: React.ReactNode;
}

export interface AuthContextType {
  auth: Auth;
  setAuth: React.Dispatch<React.SetStateAction<{}>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthLoading: boolean;
  setIsAuthLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: (auth: Auth) => void; 


}
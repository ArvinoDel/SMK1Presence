import {
  HandRaisedIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: HandRaisedIcon,
    title: "Kehadiran",
    value: "200 Hari",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "than last semester",
    },
  },
  {
    color: "gray",
    icon: BuildingLibraryIcon,
    title: "Sakit",
    value: "150 Hari",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "than last semester",
    },
  },
  {
    color: "gray",
    icon: ShieldCheckIcon,
    title: "Izin",
    value: "30 Hari",
    footer: {
      color: "text-green-500",
      value: "+2%",
      label: "than last semester",
    },
  },
  {
    color: "gray",
    icon: ExclamationCircleIcon,
    title: "Alfa",
    value: "20 Hari",
    footer: {
      color: "text-red-500",
      value: "+5%",
      label: "than last semester",
    },
  },
];

export default statisticsCardsData;

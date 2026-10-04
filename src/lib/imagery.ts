import type { ServiceRequest, SeniorGEvent, LearningVideo } from "@/types/entities";

// One place that decides which photograph represents what. Images are bundled
// locally (public/images) and credited in src/data/imageCredits.ts.
export type ImageSlot =
  | "home" | "lane" | "spices" | "tools" | "ac" | "station" | "auto" | "theatre" | "seats" | "cinema"
  | "heritage" | "diya" | "ellora" | "library" | "chai" | "instruments" | "musicians" | "thali"
  | "paints" | "phone" | "temple" | "park" | "hibiscus" | "meeting";

export function img(slot: ImageSlot): string {
  return `${import.meta.env.BASE_URL}images/${slot}.jpg`;
}

// Where the subject sits in each photo, so crops never cut the important part.
export const FOCAL: Partial<Record<ImageSlot, string>> = {
  home: "50% 60%",
  ac: "40% 50%",
  station: "50% 70%",
  theatre: "50% 45%",
  ellora: "50% 40%",
  temple: "50% 30%",
  musicians: "50% 40%",
};

export const SERVICE_IMAGE: Record<string, ImageSlot> = {
  "SV-AC": "ac",
  "SV-ELECTRICAL": "tools",
  "SV-PLUMBING": "tools",
  "SV-APPLIANCES": "tools",
  "SV-CARPENTRY": "tools",
  "SV-PEST": "home",
  "SV-CLEANING": "home",
  "SV-GOWITHME": "station",
  "SV-HOUSEHELP": "spices",
  "SV-BANKING": "phone",
  "SV-TAX": "meeting",
  "SV-HEALTH": "park",
};

export function requestImage(request: ServiceRequest): ImageSlot {
  if (request.category === "GO_WITH_ME") {
    const dest = (request.details as { destinationType?: string })?.destinationType;
    return dest === "hospital" ? "auto" : "station";
  }
  if (request.category === "REFERRAL") return "phone";
  return SERVICE_IMAGE[request.serviceId] ?? "home";
}

const EVENT_IMAGE: Record<string, ImageSlot> = {
  "EV-THEATRE-01": "theatre",
  "EV-FILM-01": "cinema",
  "EV-TALK-01": "seats",
  "EV-ASSOC-MEET": "meeting",
  "EV-WALK-01": "heritage",
  "EV-MUSIC-01": "instruments",
  "EV-JAZZ-01": "musicians",
  "EV-YOGA-01": "park",
  "EV-PHONE-01": "phone",
  "EV-TRIP-01": "temple",
  "EV-HOBBY-01": "paints",
  "EV-MENTOR-01": "chai",
  "EV-VOL-01": "library",
};

export function eventImage(event: SeniorGEvent): ImageSlot {
  return EVENT_IMAGE[event.id] ?? "lane";
}

const VIDEO_IMAGE: Record<string, ImageSlot> = {
  "SM-01": "phone",
  "SM-02": "phone",
  "SM-03": "phone",
  "SM-04": "phone",
  "SM-05": "phone",
  "SM-06": "phone",
  "SM-07": "park",
  "SM-08": "hibiscus",
  "SM-09": "thali",
  "SM-10": "park",
  "SM-11": "diya",
  "SM-12": "instruments",
  "SM-13": "ellora",
  "SM-14": "heritage",
};

export function videoImage(video: LearningVideo): ImageSlot {
  return VIDEO_IMAGE[video.id] ?? "lane";
}

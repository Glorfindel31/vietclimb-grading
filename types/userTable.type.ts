import type { Tables } from "~/types/supabase.type";

export type UserDataType = Tables<"users">;
export type RouteDataType = Tables<"routes">;
export type TopRecordsType = Tables<"top_records">;

export interface UserWithTopRecords extends UserDataType {
	top_records: TopRecordsType[];
}

export interface RouteWithTopRecords extends RouteDataType {
	top_records: TopRecordsType[];
}

export type RouteTabsDataType = Array<{
	zone: "Moon Korner" | "Slabber" | "High Tension" | "Da Ruff" | "Flat Door" | "Titanic" | "Hang Over Corner" | "Bob Your Uncle" | "Circle of Life";
	tabName: "MK" | "SL" | "HT" | "DR" | "FD" | "TI" | "HOC" | "BYU" | "COL";
	cardDescription: string;
	routes: RouteWithTopRecords[]
}>;


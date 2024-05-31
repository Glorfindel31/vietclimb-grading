export type RouteCount = {
	level: string;
	amount: number;
};
export type RouteCountSetter = {
	name: string;
	amount: number;
};

export interface Route {
	name: string;
	id: string;
	color: string;
	grade: string;
	setter: string;
	comment: string;
	link: string;
	date: string;
}

export interface DataStructure {
	transformedValues: Route[];
	routeNum: number;
}
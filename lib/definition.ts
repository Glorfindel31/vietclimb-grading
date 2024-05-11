import {Route} from '@/components/tableGrad/columns';
export type RouteCount = {
    level: string;
    amount: number;
};
export type RouteCountSetter = {
    name: string;
    amount: number;
};

export const transformData = (incomingData: Route[]): RouteCount[] => {
    const data: RouteCount[] = [];

    incomingData.reduce((gradeCounts, route) => {
        const existing = gradeCounts.find(d => d.level === route.grade);
        if (existing) {
            existing.amount++;
        } else {
            gradeCounts.push({
                level: route.grade,
                amount: 1,
            });
        }
        return gradeCounts;
    }, data);
    data.sort((a, b) => {
        return Number(a.level) - Number(b.level);
    });
    return data;
};

export const transformDataSetter = (incomingData: Route[]): RouteCountSetter[] => {
    const data: RouteCountSetter[] = [];
    incomingData.reduce((nameCount, route) => {
        const existing = nameCount.find(d => d.name === route.setter);
        if (existing) {
            existing.amount++;
        } else {
            nameCount.push({
                name: route.setter,
                amount: 1,
            });
        }
        return nameCount;
    }, data);
    data.sort((a, b) => {
        return Number(a.name) - Number(b.name);
    });
    return data;
};
export const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date as Date);

export const easyRouteCounter = (data: RouteCount[]): number => {
    return data.reduce((count, route) => {
        if (route.level === '1') return route.amount;
        if (route.level === '2' || route.level === '3') return count + route.amount;
        return count;
    }, 0);
};

export const normalRouteCounter = (data: RouteCount[]): number => {
    return data.reduce((count, route) => {
        if (route.level === '4') return route.amount;
        if (route.level === '5') return count + route.amount;
        return count;
    }, 0);
};

export interface Car {
    id: string;
    name: string;
    status: 0 | 1 | 2;
    criteria: Criteria[]
}

export interface Criteria {
    id: string;
    name: string;
    isGood: boolean;
    note?: string;
    carId: string
}
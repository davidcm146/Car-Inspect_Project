export interface Car {
    id: string;
    name: string;
    status: number;
    criteria: Criteria[]
}

export interface Criteria {
    id: string;
    name: string;
    isGood: boolean;
    note?: string;
    carId: string
}
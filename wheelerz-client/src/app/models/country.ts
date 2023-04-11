export interface Country {
    id: number;
    name: string;
}
export interface State extends Country {
    countryId: number;
}

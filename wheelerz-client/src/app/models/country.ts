export interface Country {
    id: number;
    name: string;
    hebname?: string;
}
export interface State extends Country {
    countryId: number;
}

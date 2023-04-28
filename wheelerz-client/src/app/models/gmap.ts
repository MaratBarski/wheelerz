export interface Gmap {
    center: {
        lat: number
        lng: number
    },
    zoom: number
    mapId: string
    marker?: string
}

export const GetDefaultGmap = (): Gmap => {
    return {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 4,
        mapId: 'map'
    }
}
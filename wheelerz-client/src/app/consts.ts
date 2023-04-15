//ng build --base-href=https://manager.ct-dent.co.il/wheelerz/

export const SERVER_URL = 'https://localhost:7059'
//export const SERVER_URL = 'https://manager.ct-dent.co.il/booking-api'

export const SEXES = [
    { key: 1, value: 'male' },
    { key: 2, value: 'female' },
    { key: 3, value: 'other' }
]
export const SEX_MAP = {
    '1': SEXES[0],
    '2': SEXES[1],
    '3': SEXES[2],
}

export const StoryUrls: { [key: number]: { view: string, share: string } } = {
    1: { view: 'stories', share: 'story' },
    2: { view: 'hotel-reviews', share: 'hotel-review' },
    3: { view: 'cities-accessibility', share: 'cities-accessibility' },
    4: { view: 'fellow-travelers', share: 'trends' }
}

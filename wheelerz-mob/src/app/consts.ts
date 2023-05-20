//ng build --base-href=https://manager.ct-dent.co.il/wheelerz/
//ng build --base-href=/client/ --output-path C:\PROJECTS\wheelerz\Wheelerz\Wheelerz\bin\Release\net6.0\Client
//ng build --base-href=http://localhost:5005/Client/


//export const SERVER_URL = 'http://localhost:7001'
export const SERVER_URL = 'https://localhost:7059'
//export const SERVER_URL = 'https://manager.ct-dent.co.il/booking-api'

export const IS_SOCKET_DISABLE = false
export const langs = ['en', 'he'];
export const deflang = 'en';

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
    0: { view: 'my-profile/general', share: '' },
    1: { view: 'stories', share: 'story' },
    2: { view: 'hotel-reviews', share: 'hotel-review' },
    3: { view: 'cities-accessibility', share: 'cities-accessibility' },
    4: { view: 'fellow-travelers', share: 'trends' }
}

export const titles = ['road_trip_stories', 'hotel_reviews', 'cities_accessibility']


//https://www.figma.com/file/c0Yvf3X27rd15JtudeKvkM/WEBAPP-Design-Wheelerz?node-id=2404-3779&t=z2om1YW229lHs7hV-0
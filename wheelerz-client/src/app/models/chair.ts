export interface Chair {
    seatHeight: number
    width: number
    length: number
    messure: string
}

export const ChairOptionsDictionary: Record<number, string> = {
    //[2]: 'type_of_wheelchair_manual',
    //[2 * 2]: 'type_of_wheelchair_manual_motorized',
    [2 * 2 * 2]: 'assistance_yes',
    //[2 * 2 * 2 * 2]: 'assistance_no',
    [2 * 2 * 2 * 2 * 2]: 'can_you_walk_yes',
    //[2 * 2 * 2 * 2 * 2 * 2]: 'can_you_walk_no',
    [2 * 2 * 2 * 2 * 2 * 2 * 2]: 'private_bath_chair_yes',
    //[2 * 2 * 2 * 2 * 2 * 2 * 2 * 2]: 'private_bath_chair_no',
    [2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2]: 'contact_travelers_yes',
    //[2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2]: 'contact_travelers_no'
}

export const ChairBitOptions =
{
    "type_of_wheelchair": {
        "manual": 2,
        "motorized": 2 * 2
    },
    "assistance": {
        "yes": 2 * 2 * 2,
        "no": 2 * 2 * 2 * 2
    },
    "can_you_walk": {
        "yes": 2 * 2 * 2 * 2 * 2,
        "no": 2 * 2 * 2 * 2 * 2 * 2
    },
    "private_bath_chair": {
        "yes": 2 * 2 * 2 * 2 * 2 * 2 * 2,
        "no": 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2
    },
    "contact_travelers": {
        "yes": 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2,
        "no": 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2
    }

}

import { egfrModel } from 'src/app/services/models/egft.model';

export function toAge(birthday: number) {
    return Math.floor((Date.now() - birthday) / 31556952000);
}

export function calculatorMDRD({ gender, race, age, scr, }: egfrModel) {
    const genderAdjust = gender === 'Female' ? 0.742 : 1
    let raceAdjust: number;
    switch (race) {
        case 'Black-American':
            raceAdjust = 1.21;
        case 'Japanese':
            raceAdjust = 0.763;
        case 'Chinese':
            raceAdjust = 1.233;
        default:
            raceAdjust = 1;
            break;
    }
    const eGFR = 186 * scr ** (-1.154)
        * age ** (-0.203)
        * genderAdjust
        * raceAdjust
    return eGFR
}

export function calculator2({ gender, race, birthday, scr, scys, }: egfrModel) {
    const age = Math.floor((Date.now() - birthday) / 31556952000);
    const k = gender === 'Female' ? 0.7 : 0.9
    const genderAdjust = gender === 'Female' ? 0.969 : 1
    const a = gender === 'Female' ? -0.248 : -0.207
    const raceAdjust = race == 'Black' ? 1.01 : 1;

    const eGFR = 135 * (Math.min(scr / k, 1) ** a)
        * (Math.max(scr / k, 1) ** (-0.601))
        * (Math.min(scys / 0.8, 1) ** (-0.375))
        * (Math.max(scys / 0.8, 1) ** (-0.711))
        * (0.995 ** age)
        * genderAdjust
        * raceAdjust
    return eGFR
}
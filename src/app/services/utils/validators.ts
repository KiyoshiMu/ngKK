import { AbstractControl, ValidatorFn } from '@angular/forms';


export function birthdayValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const date = Date.parse(control.value);
        return date < (-2208970800000) || date > (1577854800000)
            ? { 'invalidBirthday': { value: control.value } } : null;
    };
}
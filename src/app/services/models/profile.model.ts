import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Profile {
    genders = [
        'Male', 'Female'
    ];

    races = [
        'Black-American', 'Other', 'Japanese', 'Chinese'
    ]
}
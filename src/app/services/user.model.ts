export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    doctorName?: string;
    doctorEmail?: string;
    birthday?: number;
    age?: number;
    race?: "Black" | "Other";
    gender?: "Female" | "Male";
}
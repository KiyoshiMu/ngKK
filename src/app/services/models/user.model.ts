export interface User {
    uid?: string;
    email?: string;
    photoURL?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    doctorName?: string;
    doctorEmail?: string;
    birthday?: number;
    age?: number;
    race?: string;
    gender?: "Female" | "Male";
}
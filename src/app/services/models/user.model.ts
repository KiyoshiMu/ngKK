export interface User {
    uid?: string;
    email?: string;
    photoURL?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    doctorName?: string;
    doctorEmail?: string;
    doctorVerified?: boolean;
    doctorNotified?: boolean;
    birthday?: number;
    age?: number;
    race?: string;
    gender?: "Female" | "Male";
}
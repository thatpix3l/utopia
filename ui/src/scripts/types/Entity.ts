export type User = {
    id: number;
    firstName: string;
    lastName: string;
};

export type Contact = {
    // FIXME: this casing is inconsistent (API side)
    FirstName: string;
    LastName: string;
    phone: string;
    email: string;
};

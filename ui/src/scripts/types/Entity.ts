export type User = {
    id: number;
    firstName: string;
    lastName: string;
};

export type Contact = {
    // FIXME: API doesn't send this yet
    // id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
};

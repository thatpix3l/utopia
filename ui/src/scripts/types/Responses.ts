import { Contact, User } from "./Entity";

type LoginResponse = {
    id: number;
    // FIXME: why does it respond with the username?
    username: string;
    // FIXME: these are missing (API side)
    // firstName: string;
    // lastName: string;
};
// TODO: once the FIXME's above are corrected, change the type to the following
// type LoginResponse = User;

type RegisterResponse = {
    success: string;
};

type AddContactResponse = {
    success: string;
};

type EditContactResponse = {
    success: string;
};

type DeleteContactResponse = {
    success: string;
};

type SearchNameResponse = {
    results: Contact[];
};

export type Responses = {
    Login: LoginResponse;
    Register: RegisterResponse;
    AddContact: AddContactResponse;
    EditContact: EditContactResponse;
    DeleteContact: DeleteContactResponse;
    SearchName: SearchNameResponse;
}

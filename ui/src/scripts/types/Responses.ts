import { Contact, User } from "./Entity";

type LoginResponse = User;

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

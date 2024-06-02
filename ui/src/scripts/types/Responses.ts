import { Contact, User } from "./Entity";

type LoginResponse = User;

type GenericResponse = {
    success: string;
};
type RegisterResponse = GenericResponse;
type AddContactResponse = GenericResponse;
type EditContactResponse = Contact & GenericResponse;
type DeleteContactResponse = GenericResponse;

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

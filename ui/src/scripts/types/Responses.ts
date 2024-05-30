// TODO: should these types have an error key as well?  It sems as if the API just sets an error key to a message if there is an error as opposed to giving some actual error status...

type LoginResponse = {
    id: number;
    username: string;
    // FIXME: these are missing (API side)
    // firstName: string;
    // lastName: string;
};

type RegisterResponse = {
    success: string;
};

type AddContactResponse = {
    success: string;
};

type EditContactResponse = {
    // FIXME: this casing is inconsistent (API side)
    Success: string;
};

type DeleteContactResponse = {
    // FIXME: this casing is inconsistent (API side)
    Success: string;
};

type Contact = {
    // FIXME: this casing is inconsistent (API side)
    FirstName: string;
    LastName: string;
    phone: string;
    email: string;
}

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

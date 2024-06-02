type LoginPayload = {
    username: string;
    password: string;
};

type RegisterPayload = {
    username: string;
    password: string;
    name_first: string;
    name_last: string;
};

type GenericContactPayload = {
    user_id: number;
    name_first: string;
    name_last: string;
    phone: string;
    email: string;
};

type AddContactPayload = GenericContactPayload;

type EditContactPayload = GenericContactPayload & { id: number };

type DeleteContactPayload = {
    id: number;
    user_id: number;
};

type SearchNamePayload = {
    user_id: number;
    search: string;
};

export type Payloads = {
    Login: LoginPayload;
    Register: RegisterPayload;
    AddContact: AddContactPayload;
    EditContact: EditContactPayload;
    DeleteContact: DeleteContactPayload;
    SearchName: SearchNamePayload;
}

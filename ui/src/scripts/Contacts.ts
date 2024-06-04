import $ from "jquery";
import { clearCookie, getUserFromCookie } from "./Cookies";
// import { user } from "./Account";
import { request } from "./API";
import { Contact } from "./types/Entity";
import { validateEmail, validatePartialName, validatePhone } from "./Validation";


$(() => {
    const user = getUserFromCookie();
    if (!user.id) {
        // comment these two lines while testing
        window.location.href = "/";
        return;
    }
    const searchButton = $<HTMLButtonElement>("#searchButton");
    const searchInput = $<HTMLInputElement>("#searchInput");

    const contactsTable = $<HTMLDivElement>("#contactsTable");

    const pagesHolder = $<HTMLDivElement>("#pagesHolder");

    const addOverlay = $<HTMLDivElement>("#addOverlay");
    const addInputs = addOverlay.find("input:is([type='text']");
    const addFirstNameInput = $<HTMLInputElement>("#addFirstNameInput");
    const addLastNameInput = $<HTMLInputElement>("#addLastNameInput");
    const addPhoneInput = $<HTMLInputElement>("#addPhoneInput");
    const addEmailInput = $<HTMLInputElement>("#addEmailInput");
    const addErrorHolder = $<HTMLParagraphElement>("#addErrorHolder");
    const addConfirmButton = $<HTMLButtonElement>("#addConfirmButton");
    // const addCancelButton = $<HTMLButtonElement>("#addCancelButton");

    const editOverlay = $<HTMLDivElement>("#editOverlay");
    const editInputs = editOverlay.find("input:is([type='text']");
    const editFirstNameInput = $<HTMLInputElement>("#editFirstNameInput");
    const editLastNameInput = $<HTMLInputElement>("#editLastNameInput");
    const editPhoneInput = $<HTMLInputElement>("#editPhoneInput");
    const editEmailInput = $<HTMLInputElement>("#editEmailInput");
    const editErrorHolder = $<HTMLParagraphElement>("#editErrorHolder");
    const editConfirmButton = $<HTMLButtonElement>("#editConfirmButton");

    // start disabled
    addConfirmButton.prop("disabled", true);
    editConfirmButton.prop("disabled", true);

    $("#logoutButton").on("click", () => {
        clearCookie();
        window.location.href = "/";
    });

    let contacts: Contact[] = [];
    let activePage = 0;
    let activeContactID = 0;
    function loadPage(page = 1) {
        activePage = page;

        // console.log(contacts);

        const pageButtons = pagesHolder.children("button");
        pageButtons.removeClass("selected");
        pageButtons.eq(page-1).addClass("selected");

        contactsTable.children(":not(:first-child)").remove();

        const offset = (page - 1) * 10;
        for (let i = offset; i < offset + 10 && i < contacts.length; i++) {
            const contact = contacts[i];

            let row = document.createElement("div");
            row.classList.add("row");
            // $(row).data("id", contact.id);

            let name = document.createElement("p");
            name.innerText = `${contact.firstName} ${contact.lastName}`;

            let email = document.createElement("p");
            email.innerText = contact.email;

            let phone = document.createElement("p");
            phone.innerText = contact.phone;

            let actions = document.createElement("div");
            let editButton = document.createElement("button");
            editButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>`;
            $(editButton).on("click", () => {
                editOverlay.removeClass("inactive");

                activeContactID = contact.id;
                editFirstNameInput.val(contact.firstName);
                editLastNameInput.val(contact.lastName);
                editPhoneInput.val(contact.phone);
                editEmailInput.val(contact.email);
            });
            let deleteButton = document.createElement("button");
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>`;
            $(deleteButton).on("click", () => {
                if (confirm(`Warning, this will delete the contact with the name '${contact.firstName} ${contact.lastName}'.`)) {
                    request("DeleteContact",
                        {
                            id: contact.id,
                            user_id: user.id,
                        },
                        (response) => {
                            console.log(response);
                            searchButton.trigger("click");
                        },
                        (errorMessage) => {
                            console.log(errorMessage);
                        });
                }
            });
            actions.append(editButton, deleteButton);

            row.append(name, email, phone, actions);

            contactsTable.append(row);
        }
    }

    searchButton.on("click", () => {
        request("SearchName",
            { user_id: user.id, search: searchInput.val() ?? "" },
            (response) => {
                contacts = response.results;

                pagesHolder.empty();
                let pageCount = Math.max(Math.ceil(contacts.length / 10), 1);
                for (let i = 1; i <= pageCount; i++) {
                    let button = document.createElement("button");
                    button.innerText = i.toString();
                    $(button).on("click", () => {
                        console.log("page", i);
                        loadPage(i);
                    });
                    pagesHolder.append(button);
                }

                loadPage(Math.min(activePage, pageCount) || 1);
            },
            (error) => {
            }
        );
    });
    searchInput.on("keyup", (event) => {
        if (event.key === "Enter") {
            searchButton.trigger("click");
        }
    });

    $("#addButton").on("click", () => {
        addOverlay.removeClass("inactive");
    });

    $("#addCancelButton").on("click", () => {
        addOverlay.addClass("inactive");
    });

    // returns whether there are errors
    const validateAddContact = () => {
        const errors = validatePartialName(addFirstNameInput.val() ?? "", "First").concat(
            validatePartialName(addLastNameInput.val() ?? "", "Last"),
            validatePhone(addPhoneInput.val() ?? ""),
            validateEmail(addEmailInput.val() ?? ""),
        );
        // console.log(errors);

        addErrorHolder.html(errors.join("<br />"));
        addConfirmButton.prop("disabled", !!errors.length);

        return !!errors.length;
    };

    const addContact = () => {
        // console.log(loginUsernameInput.val(), loginPasswordInput.val());
        request("AddContact",
            {
                user_id: user.id,
                name_first: addFirstNameInput.val() ?? "",
                name_last: addLastNameInput.val() ?? "",
                phone: addPhoneInput.val() ?? "",
                email: addEmailInput.val() ?? "",
            },
            (response) => {
                console.log(response);
                searchButton.trigger("click");
            },
            (errorMessage) => {
                console.log(errorMessage);
            });

        addInputs.val("");
        addConfirmButton.prop("disabled", true); // reset its state since all inputs got wiped
        addOverlay.addClass("inactive");
    };

    addInputs.on("focus", (event) => {
        validateAddContact();
    });
    addInputs.on("keyup", (event) => {
        if (validateAddContact()) {
            return;
        }

        if (event.key === "Enter") {
            addContact();
        }
    });
    addInputs.on("blur", (event) => {
        addErrorHolder.text("");
    });

    addConfirmButton.on("click", addContact);


    $("#editCancelButton").on("click", () => {
        editOverlay.addClass("inactive");
    });

    // returns whether there are errors
    const validateEditContact = () => {
        const errors = validatePartialName(editFirstNameInput.val() ?? "", "First").concat(
            validatePartialName(editLastNameInput.val() ?? "", "Last"),
            validatePhone(editPhoneInput.val() ?? ""),
            validateEmail(editEmailInput.val() ?? ""),
        );
        // console.log(errors);

        editErrorHolder.html(errors.join("<br />"));
        editConfirmButton.prop("disabled", !!errors.length);

        return !!errors.length;
    };

    const editContact = () => {
        // console.log(loginUsernameInput.val(), loginPasswordInput.val());
        request("EditContact",
            {
                id: activeContactID,
                user_id: user.id,
                name_first: editFirstNameInput.val() ?? "",
                name_last: editLastNameInput.val() ?? "",
                phone: editPhoneInput.val() ?? "",
                email: editEmailInput.val() ?? "",
            },
            (response) => {
                console.log(response);
                searchButton.trigger("click");
            },
            (errorMessage) => {
                console.log(errorMessage);
            });

        activeContactID = 0;
        editInputs.val("");
        editConfirmButton.prop("disabled", true); // reset its state since all inputs got wiped
        editOverlay.addClass("inactive");
    };

    editInputs.on("focus", (event) => {
        validateEditContact();
    });
    editInputs.on("keyup", (event) => {
        if (validateEditContact()) {
            return;
        }

        if (event.key === "Enter") {
            editContact();
        }
    });
    editInputs.on("blur", (event) => {
        editErrorHolder.text("");
    });

    editConfirmButton.on("click", editContact);
});

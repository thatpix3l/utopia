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

    // start disabled
    addConfirmButton.prop("disabled", true);

    $("#logoutButton").on("click", () => {
        clearCookie();
        window.location.href = "/";
    });

    let contacts: Contact[] = [];
    let currentPage = 0;
    function loadPage(page = 1) {
        contactsTable.children(":not(:first-child)").remove();

        const offset = (page - 1) * 10;
        for (let i = offset; i < offset + 10 && i < contacts.length; i++) {
            const contact = contacts[i];

            let row = document.createElement("div");
            row.classList.add("row");
            $(row).data("id", contact.id);

            let name = document.createElement("p");
            name.innerText = `${contact.firstName} ${contact.lastName}`;

            let email = document.createElement("p");
            email.innerText = contact.email;

            let phone = document.createElement("p");
            phone.innerText = contact.phone;

            let actions = document.createElement("div");
            let editButton = document.createElement("button");
            editButton.innerText = "Edit";
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
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
                        loadPage(Math.min(currentPage, pageCount) || i);
                        currentPage = 0;
                    });
                    pagesHolder.append(button);
                }

                loadPage();
            },
            (error) => {
            }
        );
    });
    searchInput.on("keyup", (event) => {
        if (event.key === "Enter") {
            searchButton.trigger("click");
            addContact();
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
        console.log(errors);

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
});

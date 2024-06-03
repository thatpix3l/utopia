import $ from "jquery";
import { clearCookie, getUserFromCookie } from "./Cookies";
import { request } from "./API";
import { Contact } from "./types/Entity";
import { validatePartialName, validatePhone } from "./Validation";

$(() => {
    const user = getUserFromCookie();
    if (!user.id) {
        // comment these two lines while testing
        // window.location.href = "/";
        // return;
    }

    const searchInput = $<HTMLInputElement>("#searchInput");

    const contactsTable = $<HTMLDivElement>("#contactsTable");

    const pagesHolder = $<HTMLDivElement>("#pagesHolder");
    const addOverlay = $<HTMLDivElement>("#addOverlay");

    const addFirstNameInput = $<HTMLInputElement>("#addFirstNameInput");
    const addLastNameInput = $<HTMLInputElement>("#addLastNameInput");
    const addPhoneInput = $<HTMLInputElement>("#addPhoneInput");
    const addEmailInput = $<HTMLInputElement>("#addEmailInput");

    $("#logoutButton").on("click", () => {
        clearCookie();
        window.location.href = "/";
    });

    let contacts: Contact[] = [];
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
            actions.append(editButton, deleteButton);

            row.append(name, email, phone, actions);

            contactsTable.append(row);
        }
    }

    $("#searchButton").on("click", () => {
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

                loadPage();
            },
            (error) => {
            }
        );
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
            validatePhone(addPhoneInput.val() ?? "")
        );
        console.log(errors);

        loginErrorHolder.html(errors.join("<br />"));
        loginButton.prop("disabled", !!errors.length);

        return !!errors.length;
    };

});

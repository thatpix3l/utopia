import { request } from "./API";
import { User } from "./types/Entity";
import { storeUserToCookie } from "./Cookies";

const main = () => {

    const qs = (query: string) => document.querySelector(query);

    let user: User = { id: 0, firstName: "", lastName: "" };

    // UI elements used for manipulation.
    const elems = {

        loginTabButton: qs("#loginTabButton") as HTMLButtonElement,
        signupTabButton: qs("#signupTabButton") as HTMLButtonElement,

        loginForm: qs("#loginForm") as HTMLDivElement,
        loginUsernameInput: qs("#loginUsernameInput") as HTMLInputElement,
        loginPasswordInput: qs("#loginPasswordInput") as HTMLInputElement,

        signupForm: qs("#signupForm") as HTMLDivElement,
        signupUsernameInput: qs("#signupUsernameInput") as HTMLInputElement,
        signupPasswordInput: qs("#signupPasswordInput") as HTMLInputElement,
        signupFirstNameInput: qs("#signupFirstNameInput") as HTMLInputElement,
        signupLastNameInput: qs("#signupLastNameInput") as HTMLInputElement,

        loginErrorHolder: qs("#loginErrorHolder") as HTMLParagraphElement,
        signupErrorHolder: qs("#signupErrorHolder") as HTMLParagraphElement,

        loginButton: qs("#loginButton") as HTMLButtonElement,
        signupButton: qs("#signupButton") as HTMLButtonElement

    }

    // On login tab click, switch to login tab.
    elems.loginTabButton.onclick = () => {
        elems.loginTabButton.classList.add("selected");
        elems.signupTabButton.classList.remove("selected");

        elems.loginForm.classList.remove("inactive");
        elems.signupForm.classList.add("inactive");
    };

    // On signup tab click, switch to signup tab.
    elems.signupTabButton.onclick = () => {
        elems.signupTabButton.classList.add("selected");
        elems.loginTabButton.classList.remove("selected");

        elems.loginForm.classList.add("inactive");
        elems.signupForm.classList.remove("inactive");
    };

    // Submit login form data on login button click.
    elems.loginButton.onclick = () => {
        request("Login",
            {
                username: elems.loginUsernameInput.value,
                password: elems.loginPasswordInput.value,
            },
            (response) => {
                console.log(response);
                user.id = response.id;
                // TODO: once response.username gets replace with first and last, set these accordingly on user
                elems.loginErrorHolder.textContent = "";
                storeUserToCookie(user);
                window.location.href = "/contacts.html";
            },
            (errorMessage) => {
                elems.loginErrorHolder.textContent = errorMessage;
            });

    }

    elems.signupButton.onclick = () => {
        request("Register",
            {
                username: elems.signupUsernameInput.value,
                password: elems.signupPasswordInput.value,
                name_first: elems.signupFirstNameInput.value,
                name_last: elems.signupLastNameInput.value,
            },
            (response) => {
                console.log(response);
                elems.signupErrorHolder.textContent = "";
            },
            (errorMessage) => {
                elems.signupErrorHolder.textContent = errorMessage;
            });
    }

};

main();

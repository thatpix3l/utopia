import $ from "jquery";

import { request } from "./API";
import { User } from "./types/Entity";

$(() => {
    let user: User = { id: 0, firstName: "", lastName: "" };

    const loginForm = $<HTMLDivElement>("#loginForm");
    const signupForm = $<HTMLDivElement>("#signupForm");

    const loginUsernameInput = $<HTMLInputElement>("#loginUsernameInput");
    const loginPasswordInput = $<HTMLInputElement>("#loginPasswordInput");
    const signupUsernameInput = $<HTMLInputElement>("#signupUsernameInput");
    const signupPasswordInput = $<HTMLInputElement>("#signupPasswordInput");
    const signupFirstNameInput = $<HTMLInputElement>("#signupFirstNameInput");
    const signupLastNameInput = $<HTMLInputElement>("#signupLastNameInput");

    const loginErrorHolder = $<HTMLParagraphElement>("#loginErrorHolder");
    const signupErrorHolder = $<HTMLParagraphElement>("#signupErrorHolder");

    // handle swapping between logging in and signing up
    $("#loginTabButton").on("click", () => {
        loginForm.removeClass("inactive");
        signupForm.addClass("inactive");
    });
    $("#signupTabButton").on("click", () => {
        loginForm.addClass("inactive");
        signupForm.removeClass("inactive");
    });

    $("#loginButton").on("click", () => {
        request("Login",
            {
                username: loginUsernameInput.val() ?? "",
                password: loginPasswordInput.val() ?? "",
            },
            (response) => {
                console.log(response);
                user.id = response.id;
                // TODO: once response.username gets replace with first and last, set these accordingly on user
                loginErrorHolder.text("");
            },
            (errorMessage) => {
                loginErrorHolder.text(errorMessage);
            });
    });

    $("#signUpButton").on("click", () => {
        request("Register",
            {
                username: signupUsernameInput.val() ?? "",
                password: signupPasswordInput.val() ?? "",
                name_first: signupFirstNameInput.val() ?? "",
                name_last: signupLastNameInput.val() ?? "",
            },
            (response) => {
                console.log(response);
                signupErrorHolder.text("");
            },
            (errorMessage) => {
                signupErrorHolder.text(errorMessage);
            });
    });
});

import $ from "jquery";

import { request } from "./API";

$(() => {
    let userID = -1;

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
                userID = response.id;
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

type User = {
    id: number;
    firstName: string;
    lastName: string;
}

function storeUserToCookie(user: User) {
    const offset = 20 * 60 * 1000;
    // toGMTString() is a (deprecated) alias of toUTCString(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString
    document.cookie = `id=${user.id},firstName=${user.firstName},lastName=${user.lastName};expires=${(new Date(Date.now() + offset)).toUTCString()}`;
}

function getUserFromCookie() {
    const user: User = { id: 0, firstName: "", lastName: "" };

    document.cookie.split(",").map((expression) => {
        const [key, value] = expression.split("=");
        switch (key) {
            case "id":
                user.id = parseInt(value);
                break;
            case "firstName":
                user.firstName = value;
                break;
            case "lastName":
                user.lastName = value;
                break;
        }
    })

    return user;
}

// window.location.href = "/";

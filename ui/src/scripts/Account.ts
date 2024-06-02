import $ from "jquery";

import { request } from "./API";
import { User } from "./types/Entity";
import { storeUserToCookie } from "./Cookies";
const md5 = require("md5");

$(() => {
    let user: User = { id: 0, firstName: "", lastName: "" };

    const loginTabButton = $<HTMLButtonElement>("#loginTabButton");
    const signupTabButton = $<HTMLButtonElement>("#signupTabButton");

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
    loginTabButton.on("click", () => {
        loginTabButton.addClass("selected");
        signupTabButton.removeClass("selected");

        loginForm.removeClass("inactive");
        signupForm.addClass("inactive");
    });
    signupTabButton.on("click", () => {
        signupTabButton.addClass("selected");
        loginTabButton.removeClass("selected");

        loginForm.addClass("inactive");
        signupForm.removeClass("inactive");
    });

    const login = () => {
        // console.log(loginUsernameInput.val(), loginPasswordInput.val());
        request("Login",
            {
                username: loginUsernameInput.val() ?? "",
                password: md5(loginPasswordInput.val() ?? ""),
            },
            (response) => {
                console.log(response);

                user = response;
                loginErrorHolder.text("");
                storeUserToCookie(user);

                window.location.href = "/contacts.html";
            },
            (errorMessage) => {
                console.log(errorMessage);
                // This error message doesn't make much sense for the user for the user
                // loginErrorHolder.text(errorMessage);

                // FIXME: hopefully the API can change the response to be something like this at some point
                loginErrorHolder.text("Invalid Username");
            });
    };

    loginForm.find("input:is([type='text'], [type='password'])").on("keyup", (event) => {
        if (event.key === "Enter") {
            login();
        }
    });
    $("#loginButton").on("click", login);

    const signup = () => {
        // console.log(signupUsernameInput.val(), signupPasswordInput.val(), signupFirstNameInput.val(), signupLastNameInput.val());
        request("RegisterUser",
            {
                username: signupUsernameInput.val() ?? "",
                password: md5(signupPasswordInput.val() ?? ""),
                name_first: signupFirstNameInput.val() ?? "",
                name_last: signupLastNameInput.val() ?? "",
            },
            (response) => {
                console.log(response);

                signupUsernameInput.val("");
                signupPasswordInput.val("");
                signupFirstNameInput.val("");
                signupLastNameInput.val("");

                signupErrorHolder.text("");
            },
            (errorMessage) => {
                console.log(errorMessage);

                signupErrorHolder.text(errorMessage);
            });
    };

    signupForm.find("input:is([type='text'], [type='password'])").on("keyup", (event) => {
        if (event.key === "Enter") {
            signup();
        }
    });
    $("#signupButton").on("click", signup);
});

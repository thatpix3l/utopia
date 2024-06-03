import $ from "jquery";

import { request } from "./API";
import { User } from "./types/Entity";
import { storeUserToCookie } from "./Cookies";
import { validatePartialName, validatePassword, validateUsername } from "./Validation";
const md5 = require("md5");

// export let user: User = { id: 0, firstName: "", lastName: "" };

$(() => {
    let user: User = { id: 0, firstName: "", lastName: "" };

    const loginTabButton = $<HTMLButtonElement>("#loginTabButton");
    const signupTabButton = $<HTMLButtonElement>("#signupTabButton");

    const loginForm = $<HTMLDivElement>("#loginForm");
    const signupForm = $<HTMLDivElement>("#signupForm");

    const loginInputs = loginForm.find("input:is([type='text'], [type='password'])");
    const signupInputs = signupForm.find("input:is([type='text'], [type='password'])");

    const loginUsernameInput = $<HTMLInputElement>("#loginUsernameInput");
    const loginPasswordInput = $<HTMLInputElement>("#loginPasswordInput");
    const signupUsernameInput = $<HTMLInputElement>("#signupUsernameInput");
    const signupPasswordInput = $<HTMLInputElement>("#signupPasswordInput");
    const signupFirstNameInput = $<HTMLInputElement>("#signupFirstNameInput");
    const signupLastNameInput = $<HTMLInputElement>("#signupLastNameInput");

    const loginErrorHolder = $<HTMLParagraphElement>("#loginErrorHolder");
    const signupErrorHolder = $<HTMLParagraphElement>("#signupErrorHolder");

    const loginButton = $<HTMLButtonElement>("#loginButton");
    const signupButton = $<HTMLButtonElement>("#signupButton");

    // start disabled
    loginButton.prop("disabled", true);
    signupButton.prop("disabled", true);

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

    // returns whether there are errors
    const validateLogin = () => {
        const errors = validateUsername(loginUsernameInput.val() ?? "").concat(
            validatePassword(loginPasswordInput.val() ?? "")
        );
        console.log(errors);

        loginErrorHolder.html(errors.join("<br />"));
        loginButton.prop("disabled", !!errors.length);

        return !!errors.length;
    };

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

    loginInputs.on("focus", (event) => {
        validateLogin();
    });
    loginInputs.on("keyup", (event) => {
        if (validateLogin()) {
            return;
        }

        if (event.key === "Enter") {
            login();
        }
    });
    loginInputs.on("blur", (event) => {
        loginErrorHolder.text("");
    });

    loginButton.on("click", login);

    // returns whether there are errors
    const validateSignup = () => {
        const errors = validateUsername(signupUsernameInput.val() ?? "").concat(
            validatePassword(signupPasswordInput.val() ?? ""),
            validatePartialName(signupFirstNameInput.val() ?? "", "First"),
            validatePartialName(signupLastNameInput.val() ?? "", "Last")
        );
        console.log(errors);

        signupErrorHolder.html(errors.join("<br />"));
        signupButton.prop("disabled", !!errors.length);

        return !!errors.length;
    };

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

                // TODO: make this notify user of successful signup
            },
            (errorMessage) => {
                console.log(errorMessage);

                signupErrorHolder.text(errorMessage);
            });
    };

    signupInputs.on("focus", (event) => {
        validateSignup();
    });
    signupInputs.on("keyup", (event) => {
        if (validateSignup()) {
            return;
        }

        if (event.key === "Enter") {
            signup();
        }
    });
    signupInputs.on("blur", (event) => {
        signupErrorHolder.text("");
    });

    signupButton.on("click", signup);
});

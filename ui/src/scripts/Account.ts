import $ from "jquery";

$(() => {
    let loginForm = $<HTMLDivElement>("#loginForm");
    let signupForm = $<HTMLDivElement>("#signupForm");
    $("#loginTabButton").on("click", () => {
        loginForm.removeClass("inactive");
        signupForm.addClass("inactive");
    });
    $("#signupTabButton").on("click", () => {
        loginForm.addClass("inactive");
        signupForm.removeClass("inactive");
    });
});

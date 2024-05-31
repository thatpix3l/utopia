import { User } from "./types/Entity";

export function storeUserToCookie(user: User) {
    const offset = 20 * 60 * 1000;
    // toGMTString() is a (deprecated) alias of toUTCString(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toUTCString
    document.cookie = `id=${user.id},firstName=${user.firstName},lastName=${user.lastName};expires=${(new Date(Date.now() + offset)).toUTCString()}`;
}

export function getUserFromCookie() {
    const user: User = { id: 0, firstName: "", lastName: "" };
    const cookie = document.cookie;

    // cookie is empty
    if (!cookie) {
        return user;
    }

    // parse cookie
    cookie.split(",").map((expression) => {
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

export function clearCookie() {
    document.cookie = "id= ;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

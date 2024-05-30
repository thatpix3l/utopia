import type { AssertSameKeys } from "./types/Assertions";
import { Payloads } from "./types/Payloads";
import { Responses } from "./types/Responses";
type VerifySameKeys = AssertSameKeys<Payloads, Responses>;

function getRequestURL(type: string) {
    return `http://utopia.cleanmango.com/LAMPAPI/${type}.php`;
}

export function request<T extends keyof Payloads>(type: T, payload: Payloads[T], success: (response: Responses[T]) => void, fail: (error: Error) => void) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", getRequestURL(type), true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                success(JSON.parse(xhr.responseText));
                // TODO: will need to use this at some point
                // window.location.href = "color.html";
            }
        };
        xhr.send(JSON.stringify(payload));
    }
    catch (error) {
        if (error instanceof Error) {
            fail(error);
        }
        else {
            console.log("Error of unknown type", error);
        }
    }
}

import type { AssertSameKeys } from "./types/Assertions";
import { Payloads } from "./types/Payloads";
import { Responses } from "./types/Responses";
type VerifySameKeys = AssertSameKeys<Payloads, Responses>;

function getRequestURL(type: string) {
    return `http://utopia.cleanmango.com/LAMPAPI/${type}.php`;
}

export function request<T extends keyof Payloads>(type: T, payload: Payloads[T], success: (response: Responses[T]) => void, fail: (errorMessage: string) => void) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", getRequestURL(type), true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // success(JSON.parse(xhr.responseText));

                const response = JSON.parse(xhr.responseText);
                if (response.error) {
                    fail(response.error);
                } else {
                    success(response);
                }

                // TODO: will need to use this at some point
                // window.location.href = "color.html";
            }
        };
        xhr.send(JSON.stringify(payload));
    }
    catch (error) {
        // I don't think this catch should be reached unless send() is called multiple times for the same xhr object or there is some network error ( https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send )
        console.log("Unexpected error occured:", error);

        if (error instanceof Error) {
            fail(error.message);
        }
    }
}

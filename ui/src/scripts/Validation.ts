export function validateUsername(username: string) {
    const issues: string[] = [];
    if (username.includes(" ")) {
        issues.push("Username can't contain spaces");
    }
    if (username.length < 8) {
        issues.push("Username must be at least 8 characters long");
    }

    return issues;
}

export function validatePassword(password: string) {
    const issues: string[] = [];
    if (!password.match(/[A-Z]/)) {
        issues.push("Password must contain an uppercase letter");
    }
    if (!password.match(/[a-z]/)) {
        issues.push("Password must contain a lowercase letter");
    }
    if (!password.match(/\d/)) {
        issues.push("Password must contain a digit");
    }
    if (!password.match(/[^A-Za-z0-9]/)) {
        issues.push("Password must contain a special character");
    }
    if (password.length < 8) {
        issues.push("Password must be at least 8 characters long");
    }

    return issues;
}

// for either first or last name, not combined
export function validatePartialName(name: string, part: "First" | "Last") {
    const issues: string[] = [];
    if (!name.length) {
        issues.push(`${part} name can't be empty`);
    } else if (name.match(/[^A-Za-z]/)) {
        issues.push(`${part} name can only contain letters`);
    }

    return issues;
}

export function validateEmail(email: string) {
    const issues: string[] = [];
    if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        issues.push("Email must be in a valid form");
    }

    return issues;
}

export function validatePhone(phone: string) {
    const issues: string[] = [];
    if (!phone.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
        issues.push("Phone must be of the form (###) ###-####");
    }

    return issues;
}

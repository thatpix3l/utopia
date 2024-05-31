import { clearCookie, getUserFromCookie } from "./Cookies";

const qs = (query: string) => document.querySelector(query);

const main = () => {
    const user = getUserFromCookie();
    if (!user.id) {
        window.location.href = "/";
        return;
    }

    (qs("#logoutButton") as HTMLButtonElement).onclick = () => {
        clearCookie();
        window.location.href = "/";
    };
};

main();




// TODO: need to migrate this to ts + jquery

/*
const contacts = [];
function searchContacts() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery) || 
        contact.email.toLowerCase().includes(searchQuery) || 
        contact.phone.includes(searchQuery)
    );
    populateContactsTable(filteredContacts);
}

function showAddContactForm() {
    document.getElementById('addContactForm').style.display = 'block';
}

function hideAddContactForm() {
    document.getElementById('addContactForm').style.display = 'none';
}

function addContact(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    contacts.push({ name, email, phone });
    populateContactsTable(contacts);
    hideAddContactForm();
}

function editContact(index) {
    const contact = contacts[index];
    document.getElementById('name').value = contact.name;
    document.getElementById('email').value = contact.email;
    document.getElementById('phone').value = contact.phone;
    showAddContactForm();
    contacts.splice(index, 1);
}

function deleteContact(index) {
    contacts.splice(index, 1);
    populateContactsTable(contacts);
}

function populateContactsTable(contactsToDisplay) {
    const contactTableBody = document.getElementById('contactTableBody');
    contactTableBody.innerHTML = '';
    contactsToDisplay.forEach((contact, index) => {
        const row = `<tr>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>
                <span class="edit" onclick="editContact(${index})">Edit</span> |
                <span class="delete" onclick="deleteContact(${index})">Delete</span>
            </td>
        </tr>`;
        contactTableBody.innerHTML += row;
    });
}
*/

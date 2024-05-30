
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire2d0a"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire2d0a"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;

var $dUGcW = parcelRequire("dUGcW");
(0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))(()=>{}); // TODO: need to migrate this to ts + jquery
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


//# sourceMappingURL=contacts.337ec752.js.map

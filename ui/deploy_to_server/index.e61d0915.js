
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
function $e88568cbcf9553d1$var$getRequestURL(type) {
    return `http://utopia.cleanmango.com/LAMPAPI/${type}.php`;
}
function $e88568cbcf9553d1$export$b5fe3f66a567bec0(type, payload, success, fail) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", $e88568cbcf9553d1$var$getRequestURL(type), true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) success(JSON.parse(xhr.responseText));
        };
        xhr.send(JSON.stringify(payload));
    } catch (error) {
        if (error instanceof Error) fail(error);
        else console.log("Error of unknown type", error);
    }
}


let $9579bb9dfa75985f$var$userID = -1;
(0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))(()=>{
    const loginForm = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#loginForm");
    const signupForm = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupForm");
    const loginUsernameInput = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#loginUsernameInput");
    const loginPasswordInput = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#loginPasswordInput");
    const signupUsernameInput = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupUsernameInput");
    const signupPasswordInput = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupPasswordInput");
    const signupFirstNameInput = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupFirstNameInput");
    const signupLastNameInput = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupLastNameInput");
    const loginErrorHolder = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#loginErrorHolder");
    const signupErrorHolder = (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupErrorHolder");
    // handle swapping between logging in and signing up
    (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#loginTabButton").on("click", ()=>{
        loginForm.removeClass("inactive");
        signupForm.addClass("inactive");
    });
    (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signupTabButton").on("click", ()=>{
        loginForm.addClass("inactive");
        signupForm.removeClass("inactive");
    });
    (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#loginButton").on("click", ()=>{
        (0, $e88568cbcf9553d1$export$b5fe3f66a567bec0)("Login", {
            username: loginUsernameInput.val() ?? "",
            password: loginPasswordInput.val() ?? ""
        }, (response)=>{
            console.log(response);
            $9579bb9dfa75985f$var$userID = response.id;
            loginErrorHolder.text("");
        }, (error)=>{
            console.log(error);
            loginErrorHolder.text(error.message);
        });
    });
    (0, (/*@__PURE__*/$parcel$interopDefault($dUGcW)))("#signUpButton").on("click", ()=>{
        (0, $e88568cbcf9553d1$export$b5fe3f66a567bec0)("Register", {
            username: signupUsernameInput.val() ?? "",
            password: signupPasswordInput.val() ?? "",
            name_first: signupFirstNameInput.val() ?? "",
            name_last: signupLastNameInput.val() ?? ""
        }, (response)=>{
            console.log(response);
            signupErrorHolder.text("");
        }, (error)=>{
            console.log(error);
            signupErrorHolder.text(error.message);
        });
    });
});


//# sourceMappingURL=index.e61d0915.js.map

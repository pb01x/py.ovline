
_.roles = "public:current,std:__homestd.js";



let inputdata = [
    { name: "fun", txt: "fun", type: "hidden", value:"loginsubmit" },
    { name: "userid", txt: "UserName", type: "text", value:"prajwal" },
    { name: "password", txt:"Password", type:"password", value:"hydrogen" }
]

_.view = { type: "container", id: "logincontainer", class: "p-4 m-4", style: "display:block; background: #88335533; border-radius:10px;" };
_.parent = "#logincontainer";

_.view = { type: "tv", txt: "Login", class: "h2 redf" };

_.widget = { type: "formx", data: inputdata, lblwidth: "120px", btntxt:"Login", form:false };
_.view = { type: "btn", txt: "Login", attr:{exec:"submitlogin"}, class:"xbtn btn", style: "margin-top:4px; margin-left:125px" };

_.view = { type: "btn", txt: "Create a new account.", attr:{exec:"shownewuserform"}, class:"xbtn ", style: "display:block; margin-top:4px; margin-left:120px" };

pagedata["submitlogin"] = (e) => {

    apps.login({ username: $("#userid").val(), password: $("#password").val() });
}

pagedata["shownewuserform"] = (e) => {
    if ($("#newuser").css("display") == "none") {
        $("#newuser").css("display", "block");
        $("#logincontainer").css("display", "none");
        
    }
    else {
        $("#newuser").css("display", "none");
        $("#logincontainer").css("display", "block");
    }
    
}
    


// create new user

_.view = { type: "container", id: "newuser", parent:"x-bdy", class:"p-4 m-4", style:"display:none; background: #88335533; border-radius:10px;" }
_.parent = "#newuser";
_.view = { type: "tv", txt: "Create New User", class: "h3 block" };
let inputs = [
    { name: "fun", txt: "fun", type: "hidden", value: "createuser" },
    { name: "name", txt: "Name", type: "text" },
    { name: "userid", txt: "UserName", type: "text" },
    { name: "password", txt: "Password", type: "password" },
]
_.widget = { type: "formx", data: inputs, lblwidth: "120px", btntxt:"Create New User"  };


_.view = { type: "btn", txt: "Already Have Account, Login", attr:{exec:"shownewuserform"}, class:"xbtn ", style: "display:block; margin-top:4px; margin-left:120px" };


// function hash(str, algo) {
    
//     let hash = CryptoJS.SHA256(str);
//     let hashHex = hash.toString(CryptoJS.enc.Hex);
//     return hashHex;
// }

// console.log(hash("hydrogen"));
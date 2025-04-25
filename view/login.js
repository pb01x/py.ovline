
_.roles = "public:current,std:__homestd.js";



let inputdata = [
    { name: "fun", txt: "fun", type: "hidden", value:"loginsubmit" },
    { name: "userid", txt: "UserName", type: "text", value:"prajwal" },
    { name: "password", txt:"Password", type:"password", value:"hydrogen" }
]
_.widget = { type: "formx", data: inputdata, lblwidth: "120px", btntxt:"Login", form:false };
_.view = { type: "btn", txt: "Login", attr:{exec:"submitlogin"}, class:"xbtn btn", style: "margin-top:4px; margin-left:120px" };



pagedata["submitlogin"] = (e) => {
    apps.login({ username: $("#userid").val(), password: $("#password").val() });


}



// create new user

_.view = { type: "container", id: "newuser", class:"p-4 m-4", style:"background: #88335533" }
_.parent = "#newuser";
_.view = { type: "tv", txt: "Create New User", class: "h3 block" };
let inputs = [
    { name: "fun", txt: "fun", type: "hidden", value: "createuser" },
    { name: "name", txt: "Name", type: "text" },
    { name: "userid", txt: "UserName", type: "text" },
    { name: "password", txt: "Password", type: "password" },
]
_.widget = { type: "formx", data: inputs, lblwidth: "120px", btntxt:"Create New User"  };



// function hash(str, algo) {
    
//     let hash = CryptoJS.SHA256(str);
//     let hashHex = hash.toString(CryptoJS.enc.Hex);
//     return hashHex;
// }

// console.log(hash("hydrogen"));
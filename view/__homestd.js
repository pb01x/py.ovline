_.roles = "std:current";


_.style = "background:#33884433";

_.view = { type: "tv", txt: "This is Home", class: "h1 redf" };

_.view = { type: "btn", class: "xbtn ml-2", attr: { exec: `testbtn` }, txt: "test btn" };
_.view = { type: "btn", class: "xbtn btn ml-2", attr: { exec: `logoutx` }, txt: "LOGOUT" };

pagedata["testbtn"] = (e) => {
    console.log("yes its working");
    alert(("testbtn "));

    rqst.post(null, { fun: "directCall", username: "prajwal", surname: "basnet" }, (resp) => {
        console.log(resp);
    })
    // rqst.post(null, {fun:"__testx", username:"prajwal", surname:"basnet"}, (resp) => {
    //     console.log(resp);
    // })

};


pagedata["logoutx"] = (e) => {
    console.log("yes its working");
    rqst.post("/login", { fun: "logout" }, (resp) => {
        if (resp.status == "success") {
            ext.redirect("/login");
        }
    })
};
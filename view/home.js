_.roles = "public:current";

_.style = "background:#33884433";

_.view = { type: "tv", txt: "This is Home", class: "h1 redf" }


_.view = { type: "btn", class: "xbtn ml-2", attr: { exec: `testbtn` }, txt: "test btn" }


pagedata["testbtn"] = (e) => {
    console.log("yes its working");


    // rqst.post(null, {path:"test", nodes:"fsheetx,fsheety", username:"prajwal", surname:"basnet"}, (resp) => {
    //     console.log(resp);
    // })

    rqst.post(null, { fun: "directCall", username: "prajwal", surname: "basnet" }, (resp) => {
        console.log(resp);
    })
    // rqst.post(null, {fun:"__testx", username:"prajwal", surname:"basnet"}, (resp) => {
    //     console.log(resp);
    // })

}
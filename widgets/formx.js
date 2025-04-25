


// console.log(data);

let inputs = data.data;

let o = "";
for (const i in inputs) {
    // console.log(inputs[i]);
    let x = inputs[i];
    let display = "inline-block";
    if (x.type=="hidden") {
        display = "none";
    }

    o += `<div class="p-2"><label  style=" display:${display}; width:${data.lblwidth}" for="${x.name}">${x.txt}</label> <input id="${x.name}" name="${x.name}" type="${x.type}" value="${x.value??""}"></div>`;
   
}

let btntxt = data.btntxt ?? "Submit";
let formpost = data.form ?? true;



if (formpost) {
    o += `<div class="p-2"> <input class="btn" style="margin-left:${data.lblwidth}" type="submit" value="${btntxt}"> </div>`;
    _.raw=`<form action="" >${o}</form>`
    
}
else {
    _.raw = o;
    
}
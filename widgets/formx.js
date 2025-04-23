


console.log(data);

let inputs = data.data;

let o = "";
for (const i in inputs) {
    console.log(inputs[i]);
    let x = inputs[i];
    o += `<div class="p-2"><label  style=" display:inline-block; width:${data.lblwidth}" for="${x.name}">${x.txt}</label> <input name="${x.name}" type="${x.type}" value=""></div>`;
}

let btntxt = data.btntxt??"Submit";
o += `<div class="p-2"> <input class="btn" style="margin-left:${data.lblwidth}" type="submit" value="${btntxt}"> </div>`;


_.raw=`<form action="" >${o}</form>`
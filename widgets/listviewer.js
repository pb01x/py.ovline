

let x=data.data    
let xid = ext.randid(10);

_.raw = `<style>
    #${xid} .item{
        display:block;
        padding:0px 0px 6px 10px;
    }
</style>`;


let htmll= `<div id="${xid}">`;

for (const key in x) {
    let txt = x[key]["txt"] ?? x[key];
    if (x[key]["url"]!=undefined) {
        htmll += `<a class="item" href="${x[key]["url"]}">${txt}</a>`;
    }
    else {
        htmll += `<span class="item">${txt}</span>`;
    }
}

htmll += `</div>`;

_.raw = htmll;
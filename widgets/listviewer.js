

let x = data.data;
let xid = ext.randid(10);

_.raw = `<style>
    #${xid} .item{
        display:block;
        padding:0px 0px 6px 10px;
        width:100%;
        margin-top:1px;
    }
</style>`;


let htmll= `<div id="${xid}">`;

for (const key in x) {
    let txt = x[key]["txt"] ?? x[key];
    htmll += `<button style="color: inherit" class="item xbtn txtbtn alignl" exec="${x[key].exec}" x-data="${x[key]["x-data"]}">${txt}</button>`;
   
}
htmll += `</div>`;
_.raw = htmll;
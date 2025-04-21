
// const view = {
//     tv: (args=[]) => {
//         return createvw("span",true, args["id"], null, getViewStr(args["txt"]));
//     },
//     input: (args = []) => {
//         //id, name, type, placeholder, isreadonly
//         let atx = attr("value",args["val"])+ attr("name", args["name"]) + attr("type", args["type"]) + attr("placeholder", getViewStr(args["txt"],1))+" autocomplete='off' " + (args["isreadonly"]==1 ? " readonly" : "");
//         // console.log(atx);
//         // console.log(getViewStr(args["txt"], 1));
//         // console.log(args);
//         return createvw("input", false, args["id"], atx);
//     },
//     btn: (args=[]) => {
//         return createvw("button",true, args["id"],args["attr"]!=undefined?"actionx="+args["attr"]:"" , args["txt"]);
//     },
//     a: (args=[]) => {
//         return createvw("a", true ,args["id"], "href='"+args["url"]+"'", args["txt"] );0
//     },
//     container: (args = []) => {
//         // console.log(args);
//         return createvw("div",true, args["id"],null, null);
//     }
// }

// function createvw(tag, closetag, id, attrx, innerhtml) {
//     let tagx = closetag ? `</${tag}>` : "";
//     let attrs = "";
//     // attrs += id != null ? " id='" + id + "'" : "";
//     attrs += attr("id",id);
//     attrs += attrx ? " " + attrx : "";
   
//     innerhtml = innerhtml ? innerhtml : "";
//     // console.log(`<${tag} ${attrs}>`+innerhtml+tagx);
//     return $(`<${tag} ${attrs}>`+innerhtml+tagx);

// }

// function attr(k, v) {
//     if (v!=undefined) {
//         if (v.substring(0,1)=="@") {
//             // console.log(v);
//             return "";
//         }
//     }
    
//     return v ? " "+k + "='" + v + "'" : "";
// }



// function renderTable(DTx, classx) {
//     let header = "<tr>";
//     let colnames = DTx["cols"];
//     for (const k in colnames) {
//         header += `<th>${colnames[k]}</th>`;
//     }
//     header += "</tr>";

//     let dmx = DTx["data"];
//     let rows = "";
//     for (const k in dmx) {
//         let rw = dmx[k];
//         let rwhtml = "<tr>";
//         for (const l in rw) {
//             rwhtml += `<td>${rw[l]}</td>`;
//         }
//         rwhtml += "</tr>";
//         rows += rwhtml;
//     }
    
//     return `<table class="${classx}">${header+rows}</table>`;

// }
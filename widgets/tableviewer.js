


let dtx = data.data
let outx = "";

console.log(dtx["name"]);
outx += `<tr class="accent">`;
for (const key in dtx["name"]) {
    outx += `<td>${dtx["name"][key]}</td>`;
}
outx += `</tr>`;

console.log(dtx["data"]);
for (const key in dtx["data"]) {
    outx += `<tr>`;
    for (const k in dtx["data"][key]) {
        outx += `<td class="px-2">${dtx["data"][key][k]}</td>`;
    }
    outx += `</tr>`;
}

_.raw = `<table>${outx}</table>`;




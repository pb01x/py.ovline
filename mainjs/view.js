const view = {
  tv: (layout) => {
    return createElement("span", layout);
  },
  a: (layout) => {
    return createElement("a", layout);
  },
  btn: (layout) => {
    return createElement("button", layout);
  },
  container: (layout) => {
    return createElement("div", layout);
  },
  input: (layout) => {
    return createElement("input", layout);
  },
  textarea: (layout) => {
    return createElement("textarea", layout);
  },
  select: (layout) => {
    return createElement("select", layout);
  }
};

function createElement(tag, layout) {
  let outp = tag !="input"? `<${tag} *attributes>*txt</${tag}>`:`<${tag} autocomplete="off" *attributes>`;
  let attr = "";
  let txt = "";
  for (const key in layout) {
    if (layout[key] == undefined) continue;
    switch (key) {
      case "txt":
        txt += getViewStr(layout[key]);
        break;
      case "name":
        attr += ` name="${layout[key]}"`;
        break;
      case "href":
        attr += ` href="${layout[key]}"`;
        break;
      case "class":
        attr += ` class="${layout[key]}"`;
        break;
      case "style":
        attr += ` style="${layout[key]}"`;
        break;
      case "id":
        attr += ` id="${layout[key]}"`;
        break;
      case "value":
        attr += ` value="${layout[key]}"`;
      break;
      case "placeholder":
        attr += ` placeholder="${getViewStr(layout[key],1)}"`;
        break;
      case "attr":
        for (const km in layout[key]) {
          if (layout[key][km] == undefined ) continue;
          attr += ` ${km}="${layout[key][km]}"`;
        }
        break;
      case "attrx":
        attr += " "+layout[key]+" ";
        break;
      case "options":
        for (const k in layout[key]) {
          let kxm = layout[key][k];
          txt+= `<option value='${kxm[0]}'>${kxm[1]}</option>`;
        }
        break;
      case "inptype":
        attr += ` type="${layout[key]}"`;
        break;
      default:
        break;
    }
  }

  outp = outp.replace("*txt", txt);
  outp = outp.replace("*attributes", attr);
  return outp;
}



function renderTable(DTx, classx) {
    let header = "<tr>";
    let colnames = DTx["cols"];
    for (const k in colnames) {
        header += `<th>${colnames[k]}</th>`;
    }
    header += "</tr>";

    let dmx = DTx["data"];
    let rows = "";
    for (const k in dmx) {
        let rw = dmx[k];
        let rwhtml = "<tr>";
        for (const l in rw) {
            rwhtml += `<td>${rw[l]}</td>`;
        }
        rwhtml += "</tr>";
        rows += rwhtml;
    }
    
    return `<table class="${classx}">${header+rows}</table>`;

}
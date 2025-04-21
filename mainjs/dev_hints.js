$("html").keydown(function (e) {
  if ((e.ctrlKey || e.altKey) && e.key == "s") {
    e.preventDefault();
    save_code_input();
  }
});

$("html").on("keydown", "#dev_input", function (e) {
    let tArea = $("#dev_input");
    completeAfterEquals(e, tArea);
  // if (e.which == 13) {
  //   let tArea = $("#dev_input");
  //   let arr= getlastline(tArea).split(":");
  //   let hints = gethints(arr);
  //   if (hints!=undefined) {
  //     e.preventDefault();
  //     inserthints(hints,tArea);
  //   }
  //   // save_code_input();
  //   return true;
  // }
 
});


function completeAfterEquals(e, tArea) {

  if (e.which == 187 || e.which==9) {
    let a= autofillCode(e, tArea);
    if (a == 0 && e.which == 9) { e.preventDefault();; inserthints('   ', tArea,0,false); }
  }

  if (e.which == 222 ) {
    e.preventDefault();
    if (e.shiftKey) { inserthints('""', tArea); }
    else { inserthints("''", tArea); }
    
  }
}


function autofillCode(e,tArea) {
  let arr = getlastline(tArea);
  if (arr.includes("=")) { return };
  if (arr.includes(".style")) {
    inserthints('=" ";', tArea);
    e.preventDefault();
  }
  if (process("view")) return 1;
  if (process("widget")) return 1;
  if (process("datapool")) return 1;
  return 0;

  function process(keyword) {
    if (arr.includes("."+keyword) && !arr.includes(`.${keyword}={`)) {
      let viewtype = arr.split("."+keyword)[1];
      inserthints("=" + gethints([keyword, viewtype]), tArea, viewtype.length);
      e.preventDefault();
      return 1;
    }
    return 0;
  }
}

function save_code_input() {
  $("x-bdy").html("");
  rqst.post(null, { rqtype: "dev_code", dev_code: $("#dev_input")[0].value });
}


function inserthints(hints, tArea, nbackspace = 0, isToSelect = true) {
  if (hints == "=") return;
  let b = tArea[0].selectionStart;
  let str = tArea.val();
  let parta = str.substr(0, b-nbackspace);
  let partb = str.substr(b, str.length-b);
  tArea.val(parta + hints + partb);
  // console.log(parta);
  // console.log(hints);
  // console.log(partb);

  if (isToSelect) {
    tArea[0].selectionStart = b + 1 - nbackspace;
    tArea[0].selectionEnd = b + hints.length + 1 - nbackspace - 1;
  }
  else {
    tArea[0].selectionStart = b + hints.length + 1 - nbackspace - 1;
    tArea[0].selectionEnd = b + hints.length + 1 - nbackspace - 1;
  }
}



function getlastline(tArea) {
  let b = tArea[0].selectionStart;
  let str = tArea.val();
  let pos_start = 1;
  let a = 0;
  while (pos_start < b && pos_start>0) {
    a = pos_start;
    pos_start = str.indexOf("\n", pos_start + 2);
  }
  return str.substr(a, b - a).trim();
}


function gethints(arr) {
  switch (arr[0]) {
    case "view":
      switch (arr[1].trim()) {
        case "tv":
          return '{type:"tv", txt:" "};';
     
        case "input":
          return '{type:"input", typex:"text", value:``, name:``, attr: { notnull:1, datatype:"text"}  };';
        case "textarea":
          return '{type:"textarea",  name:``, text:"" };';
        case "btn":
          return '{type:"btn", txt:"", class:"xbtn",attr:{exec: `` }};';
        case "a":
          return '{type:"a", txt:"", href:""};';
        case "container":
          return '{type:"container", id:" "};';
        default:
          return "";
      }
      break;
    case "widget":
      let name = arr[1];
      let wid_raw = getwidget(name);
      let alloccrs = wid_raw.split("data.");
      let outp = [];
      for (let i = 1; i < alloccrs.length; i++) {
        let a = split_by_non_alphanumeric(alloccrs[i])[0];
        if (outp.includes(a + ":''")) continue;
        outp.push(a + ":''");
      }
      return "{ type:'"+name+"', "+outp.join(", ")+"};";
    case "datapool":
      return '{ id:".", output:""};';
    default:
      return "";
  }
}



function getWidgetPars(layout) {

    // console.log(a);

}
var a = 0;

window.onload = function () {
    'use strict'; 
}

// setTimeout(() => {
//     rqst.post("tesxxxxxxxx", { "afor": "APPLE" })

// }, 1000);


// console.log("loading main js");
const rqst = {
    post: (url, data, callback, updateurl = true, cache = false) => {
        console.log("posting .......");
        rqst.postx(url, data, callback, updateurl,cache);
    },
    postx: (url, data, callback, updateurl = true, cache = false) => {
        console.log("post from x .......");
        progress(10);
        if (data == null) { data = {} };
        data["st"] = [$("menu-t").attr("static-id")??"", $("menu-l").attr("static-id")??"" ];
        // console.log(data["st"]);
        // console.log($("menu-t").attr("static-id"));
        if (cache==true  && $("#cachebtn")[0].checked) {
            let idx="";
            if (data["tag"]!=undefined) {
                console.log("tagged");
                idx=getvalue("cachex"+data["tag"]);
                console.log("tagged val:"+idx);
            }
            else{
                idx=hash(JSON.stringify(data));
            }
            if (idx == hash(JSON.stringify(data))) {

                let f = getvalue(idx);
                if (f != null) {
                    asyncx(() => {
                        let xx = JSON.parse(f);
                        if (callback) {
                            callback(xx);
                            return;
                        }
                        rqst.handler(xx, updateurl);
                    })
                    return;
                }
            }
        }
        
       
        start("transport-time");
        $.ajax({
            type: "POST",
            dataType: "text",
            url: (url??window.location.pathname),
            data: process_ajax_data({ ...data}),
            success: function (response) {
                progress(80);
                // console.log(response);
                let resp = processRawResponse(response);
                console.log(resp);
                if (cache==true) {
                    let idx=hash(JSON.stringify(data));
                    if (data["tag"]!=undefined) {
                        storeval("cachex"+data["tag"],idx);
                    }
                    storeval(idx,JSON.stringify(resp));
                }
                if (callback) {
                    callback(resp);
                    progress(100);
                    return;
                }
                else{progress(100);}
                rqst.handler(resp,updateurl);
            },
            error: function (e) {
                end("transport-time");
                console.log(e.statusText);
                console.log("ERROR-ajax");
                
            }

        });
    },
    postscrp: (url, data, callback, updateurl = true, cache = false) => {
        console.log("post from scrap .......");
            
        progress(10);
        if (data == null) { data = {} };
        data["st"] = [$("menu-t").attr("static-id")??"", $("menu-l").attr("static-id")??"" ];
       
       
        start("transport-time");
        $.ajax({
            type: "POST",
            dataType: "text",
            url: (url??window.location.pathname),
            data: process_ajax_data({ ...data}),
            success: function (response) {
                progress(80);
                let respx = JSON.parse(response);
                let resp = JSON.parse(atob(respx["data"]));
                
                console.log(resp);
           
                if (callback) {
                    callback(resp);
                    progress(100);
                    return;
                }
                else{progress(100);}
                rqst.handler(resp,updateurl);
            },
            error: function (e) {
                end("transport-time");
                console.log(e.statusText);
                console.log("ERROR-ajax");
                
            }

        });
    },
    handler: (response,updateurl) => {
        for (const key in response) {
            // console.log(key);
            switch (key) {
                case "error":
                    console.log('%c%s','color:orange',response[key]);
                    break;
                case "dev_code":
                    break;
                case "session":
                    storeval("session_" + response["session_type"], JSON.stringify(response["session"]));
                    cacheA["session_" + response["session_type"]] = response["session"];

                    
                    // console.log(getvalue("session_cos"));
                    break;
                case "ValidationError":
                    console.log(response[key]);
                    for (const k in response[key]) {
                        let inps = $("input[name='" + k + "']");
                        if (inps.length==1) {
                            $("input[name='" + k + "']").addClass("error");
                        }
                    }
                    return;
                    break;
                case "lang_str":
                    langstr = response[key];    
                    break;
                case "url":
                    // if(response["url"]==window.href)
                    if (response["layout"]["pop"] != undefined) continue;
                    if (updateurl==false) continue;
                    pagedata = [];
                    history.pushState(null, '', response["url"]);
                    break;
                case "ForceContent":
                    let fc = response["ForceContent"];
                    for (const key in fc) {
                        // console.log(fc[key]);
                       switch (fc[key][0]) {
                           case "table":
                               console.log($(fc[key][1]));
                               $(fc[key][1]).html("xxxxxxxxxxxxxx");
                               $(fc[key][1]).html(renderTable(fc[key][2],"tbl")  );
                            break;
                       
                        default:
                            break; 
                       }
                    }
                    break;
                default:
                    break;
            }
        }
        if (response["layout"] != undefined) {
            insertDevCode(response);
            if (!window.location.href.includes("/db/")) {
                runlayout();
            }
        }
        function runlayout() {
            start("ui-processing-time");
            $("x-pop").css("display", "none");
            handleLayout(response["layout"],null,response);
            feather.replace();
            ext.autopad();
            ext.r1panel(true);            
            // console.log("UI ",end("ui-processing-time"));
            
            let contentwidth = $("x-bdy").width() + $("menu-l").width() + $("x-r1panel").width();
            if ($(window).width() < contentwidth) {
              $("x-r1panel").css("display","none");
            } else {
              $("x-r1panel").css("display","block");
            }

        }

       
    },



}




const apps = {
    login: (allpars) => {

        let publickey=ext.randid(64);
        let pswd=hash(allpars["password"]);
        let timestamp=(new Date()).valueOf();
        let localkey=hash(pswd+publickey)+"-"+timestamp;
      
        console.log("locakkey js ",localkey);

        storeval("localkey",localkey);

        let parx=[];
        parx["timestampx"]=timestamp;
        parx["apid"]="login__user";
        parx["publickey"]=publickey;
        parx["username"]=allpars["username"];
      

        //pending here
        rqst.post(null,parx, (resp)=>{
            // console.log("called back login");
            // console.log("is signed match ", resp["sign_match"]);

            if (resp["isloggedIn"] == 1) {
                storeval("isloggedIn", 1);
                storeval("publickey", resp["publickey"]);
                rqst.handler(resp);
                // rqst.post("/",  { rqtype: "init" });
            } else {
                $("#loginstatus").css("display", "block");
            }


        });


    }




}
function App_buildtree(parent,data, map) {
    let id;
    let hid;
    let isgrp;
    map = firstRow_to_dic(map);
    id = map["id"];
    hid = map["hid"];
    isgrp = map["isgrp"];
    txt = map["txt"];
    descp = map["descp"];
    rtcol = map["rtcol"];


    let treePrefix = ext.randid(5);
    parent = $("#" + parent);

    let widi = `_.widget={type:"row1", class:" item "+data.folder, attr:{ xid: data.xid }, title: data.title, rtcol: data.rtcol, subtitle: data.subtitle}`;

    let tempdata = [];
    // tempdata[0] = $("<div></div>");
    tempdata[0]=parent;
    
    for (const key in data) {
        let prnt = `<div id="${treePrefix + data[key][id]}" class="pl-10 treenode"></div>`;
        let _isfolder=data[key][isgrp]?1:0;
        prnt = $(prnt);
        handleLayout(widi, prnt, {folder:data[key][isgrp]==1?"folder":"file" , xid:data[key][id]+"."+data[key][hid]+"."+_isfolder, title: data[key][txt], subtitle:data[key][descp], rtcol:((data[key][isgrp]==0 && data[key][rtcol]!=0 )? data[key][rtcol]:undefined)  },false);
        tempdata[data[key][id]] = prnt;
    }
    
    parent.append(tempdata[0]);
    for (const k in data) {
        tempdata[data[k][hid]].append(tempdata[data[k][id]]);
    }

    parent.find(".item").click(function (e) {
        parent.find(".item").removeClass("active");
        $(e.currentTarget).addClass("active");
    })
    parent.find(".item").on( "contextmenu", function(e) {
        parent.find(".item").removeClass("active");
        $(e.currentTarget).addClass("active");
      } );

}


// function App_buildtree(parent,data, map,descp) {
//     let id;
//     let hid;
//     let isgrp;
//     map = firstRow_to_dic(map);
//     id = map["id"];
//     hid = map["hid"];
//     isgrp = map["isgrp"];
//     let treePrefix = ext.randid(5);
//     parent = $("#" + parent);

//     let widi = [];
//     widi["widget:row2"] = [];
//     widi["widget:row2"]["args"] = { xtitle: "@title" };

//     let tempdata = [];
//     tempdata[0]=$("<div></div>");
//     for (const key in data) {
//         let prnt = `<div id="${treePrefix + data[key][id]}" class="pl-10"></div>`;
//         prnt = $(prnt);
//         handleLayout(widi, prnt, { title: data[key][id]+" " + data[key][descp] });
//     //    $("#" + parent).append(prnt);
//         tempdata[data[key][id]] = prnt;
//     }
    
//     parent.append(tempdata[0]);

//     for (const k in data) {
//         tempdata[data[k][hid]].append(tempdata[data[k][id]]);
//     }
//     // console.log(tempdata);
//     // parent.append(tempdata[0]);

// }



function combobox(data, formid, inpname, txt, id, defaultval, rowid, newopt) {
    rowid = rowid ?? "";
    // console.log("#" + formid + inpname + rowid);
    $("#" + formid + inpname + rowid).addClass("cmb");
    // console.log($("#" + formid + inpname));
    let varid = "cmb" + formid + inpname+rowid;
    pagedata[varid] = [];
    pagedata[varid]["data"] = data;
    pagedata[varid]["formid"] = formid;
    pagedata[varid]["inpname"] = inpname;
    pagedata[varid]["txt"] = txt;
    pagedata[varid]["id"] = id;
    pagedata[varid]["newopt"] = newopt;
    pagedata[varid]["defaultval"] = defaultval;
  }
var currentprocess;
function combobox_render(inp, filter) {
    // let inp = $(e.target);
    
    let inpid = inp.attr("id");
    let xdt = pagedata["cmb" + inpid];
    render();

    inp.addClass("active");

    function render() {
        hidecombo(1);
        let output = "<div id='pnl"+inpid+"' class='cmbpnl'><ul>@content</ul></div>";
        let content = "";
        let nrw = 0;
        for (const key in xdt["data"]) {
            let txtx = xdt["data"][key][xdt["txt"]];
            let dataid = xdt["data"][key][xdt["id"]];
            if (filter==undefined) {
                content += `<li data-id="${key}" data-idx="${dataid}">${txtx}</li>`;
                nrw++;
            }
            else {
                if (txtx.toLowerCase().startsWith(filter.toLowerCase())) {
                    content += `<li data-id="${key}" data-idx="${dataid}">${txtx}</li>`;
                    nrw++;
                }
            }
        }
        if (nrw == 0) {
            content += `<li class="xbtn" exec="pop.${ xdt.newopt}">${ext.icon("plus","red","1rem",4)} Add New Item</li>`;
        }
        output = output.replace("@content", content);
        output = $(output);
        inp.after(output);
        if(nrw==0)feather.replace();
        output.css("left", inp.offset().left);
        output.css("width", inp.outerWidth());
    }
}


function hidecombo(e) {
    if (e == 1) hide();
    if (!$(e.target).hasClass("cmb") && !$(e.target).hasClass("cmbpnl")) {
        hide();
    }
    function hide() {
        $(".cmbpnl").remove();
        $(".cmb").removeClass("active");
    }
}



$("html").on("keydown", ".cmb", function (e) {
    if (e.keyCode == 40) {
        changeComboActiveIndex(e, 1);
    }
    else if (e.keyCode == 38) {
        changeComboActiveIndex(e, -1);
    }
    else if (e.keyCode == 9) {
        hidecombo(1);
    }
    else if (e.keyCode == 13) {
        hidecombo(1);
    }
    
});

$("html").on("keyup", ".cmb", function (e) {
  
    if (e.ctrlKey) return;
    if ((e.keyCode > 47 && e.keyCode < 90) || e.keyCode == 8) {
        combobox_render($(e.target), $(e.target).val());
        if (e.keyCode != 8) {
            let valx = $(e.target).val();
            let newactiveli = $($(".cmbpnl").find("li")[0]);
            newactiveli.addClass("active");
            let n = valx.length;
            apply_combo_val($(e.target));
            e.target.setSelectionRange(n, $(e.target).val().length);
        
        }
    }
       
});




$("html").on("click", "li", function (e) {
    if ($(e.target).hasClass("xbtn")) return;
    let cmbid = $(e.target).closest(".cmbpnl").attr("id");
    cmbid = cmbid.substring(3, cmbid.length);
    // $("#" + cmbid).val($(e.target).html());
    $(".cmbpnl li.active").removeClass("active");
    $(e.target).addClass("active");
    apply_combo_val($("#"+cmbid))
})



function changeComboActiveIndex(e, modifier) {
    let inpid = $(e.target).attr("id");
    let currentli = $("#pnl" + inpid).find("li.active");
    let len = $("#pnl" + inpid).find("li").length;
    let activeindex = currentli.index();
    currentli.removeClass("active")
    let newindex = activeindex + modifier;
    if (newindex < 0) newindex = len - 1;
    if (newindex > len-1) newindex = 0;
    
    let newli = $($("#pnl" + inpid).find("li")[newindex]);
    // $("#" + inpid).val(newli.html());
    newli.addClass("active");
    apply_combo_val($(e.target));
}


function apply_combo_val(inp) {
    let inpid = inp.attr("id");
    let dt = pagedata["cmb" + inpid];
    let newli = $("#pnl" + inpid).find("li.active");
    if (newli.attr("data-id") == undefined) return;
    $("#" + inpid).val(dt["data"][newli.attr("data-id")][dt["txt"]]);
    $("#" + inpid).attr("data-id", newli.attr("data-id"));
    $("#" + inpid).attr("data-idx", newli.attr("data-idx"));
}

function getFinalComboVal(inp) {
    let inpid = inp.attr("id");
    let dt = pagedata["cmb" + inpid];
    let dataindex = $("#" + inpid).attr("data-id");
    // console.log(newli.attr("data-id")]);
    if (dataindex == undefined) {
        if (dt["defaultval"]!=null) {
            return dt["defaultval"];
        }
        else {
            return null;
        }
    }
    let xval = dt["data"][dataindex][dt["txt"]];
    let xid = dt["data"][dataindex][dt["id"]];
    if (xval != inp.val()) {
      throw 0;
    }
    return xid;
  
}
var z = 0;

var dateformat = ["y", "m", "d"];
var dateseparator = "-";

function today(aY, aM, aD) {
    let date = new Date();
    if(aD) date.setDate(date.getDate() + aD);
    if (aM) { date.setMonth(date.getMonth() + aM); };
    if(aY) date.setFullYear(date.getFullYear() + aY);
    // console.log(date);
    return format(date);
}



function format(date) {
    // date = new Date(date);
    datex = [];
    datex["d"] = ('0' + date.getDate()).slice(-2);
    datex["m"] = ('0' + (date.getMonth() + 1)).slice(-2);
    datex["y"]= date.getFullYear();

    let final = [];
    for (const key in dateformat) {
        final.push(datex[dateformat[key]]);
    }
    return final.join(dateseparator);
}


//get 20240722 format
function datexser(b) {
    let datarr = b.split(dateseparator);
    let datexx = [];

    for (const key in dateformat) {
        datexx[dateformat[key]] = datarr[key];
    }
    //console.log(new Date(datexx["y"], datexx["m"], 0).getDate());
    if (datexx["m"]>12) {
        return -1;
    }
    else if (new Date(datexx["y"], datexx["m"], 0).getDate()<datexx["d"]) {
        return -1;
    }

    if (([Number(datexx["y"]),Number(datexx["m"]),Number(datexx["d"])]).includes(0)) {
        return -1;
    }
    const datenew=new Date(datexx["y"],datexx["m"],datexx["d"]);
    // console.log("y",datenew.getMonth());
    let month=datenew.getMonth()<10?"0"+datenew.getMonth():datenew.getMonth();
    let day=datenew.getDate()<10?"0"+datenew.getDate():datenew.getDate();

    return datenew.getFullYear().toString()+month+day;
}


function dateToval(b) {
    const msday = 1000 * 60 * 60 * 24;
    let datarr = b.split(dateseparator);
    let datexx = [];
    for (const key in dateformat) {
       
        datexx[dateformat[key]] = datarr[key];
    }
    // console.log(new Date(datexx["y"], datexx["m"], 0).getDate());
    if (datexx["m"]>12) {
        return -1;
    }
    else if (new Date(datexx["y"], datexx["m"], 0).getDate()<datexx["d"]) {
        return -1;
    }

    if (([Number(datexx["y"]),Number(datexx["m"]),Number(datexx["d"])]).includes(0)) {
        return -1;
    }


    const utca = Date.UTC(2000, 1, 1);
    const utcb = Date.UTC(datexx["y"], datexx["m"], datexx["d"]);

    return Math.floor((utcb - utca) / msday);
}




function dateToUnix(b) {
    let datarr = b.split(dateseparator);
    let datexx = [];

    for (const key in dateformat) {
        datexx[dateformat[key]] = datarr[key];
    }
    // console.log(new Date(datexx["y"], datexx["m"], 0).getDate());
    if (datexx["m"]>12) {
        return -1;
    }
    else if (new Date(datexx["y"], datexx["m"], 0).getDate()<datexx["d"]) {
        return -1;
    }

    if (([Number(datexx["y"]),Number(datexx["m"]),Number(datexx["d"])]).includes(0)) {
        return -1;
    }
    const datenew=new Date(datexx["y"],datexx["m"]-1,datexx["d"]);

    // console.log(datexx);
    // console.log(datenew);
    
    return Math.round(Date.parse(datenew) / 1000);
}

function valTodate(c) {
    const msday = 1000 * 60 * 60 * 24;
    const utca = Date.UTC(2000, 1, 1);
    let aa = c * msday + utca;
    let date = new Date(aa);
    datttt = [];
    datttt["y"] = date.getFullYear();
    datttt["m"] = date.getMonth();
    datttt["d"] = date.getDay();
    let finaldate = [];
    for (const key in dateformat) {
        let dhujsa = datttt[dateformat[key]];
        finaldate.push(dhujsa<10?"0"+dhujsa:dhujsa);
    }
    return finaldate.join(dateseparator);
}


$("html").on("keydown", ".date", function (e) {

    let vv = $(e.target).val();
    let im = e.target.selectionStart;
    
    if (e.which == 37 || e.which == 39) {

    }
    else if (e.which == 8) {
        e.preventDefault();
        let x = e.target.selectionStart;
        if (x==0) {
            return;
        }
        if (vv.substring(x - 1, x) == dateseparator) {
            e.target.setSelectionRange(x - 1, x - 1);
            return;
        }
        $(e.target).val(vv.substring(0, x-1) + " " + vv.substring(x, vv.length));
        e.target.setSelectionRange(x-1, x-1)
        
    }
    else if (im >= 10) {
        e.preventDefault(); return;
    }
    else  if ((e.which >= 48 && e.which <= 57) || e.which >= 96 && e.which <= 105) {
        let i = e.target.selectionStart;
        if (vv.substring(im,im+1)=="-") {
            i++;
        }
        e.target.setSelectionRange(i, i + 1);

    } 
    else {
        // console.log(e.which);
        e.preventDefault();
    }

  

    // console.log(e.target);
})


$("html").on("keyup", ".date", function (e) {
    // if (!$.isNumeric(e.key)) {
    let input = e.target;
    let vv = $(input).val();
    if (e.which == 37) {
        let x = input.selectionStart;
        let nxtchar = vv.substring(x, x + 1);
        if (nxtchar==dateseparator) {
            input.setSelectionRange(input.selectionStart, input.selectionStart-1);
        }
    }
    else if(e.which==39 ) {
        
    }
    else if (e.which == 8) {
        
        
    }
    else {
        // console.log(e.which);
        let x = input.selectionStart;
        let nxtchar = vv.substring(x, x + 1);
        if (nxtchar==dateseparator) {
            input.setSelectionRange(input.selectionStart+1, input.selectionStart+1);
        }
    }
    if ( dateToval($(e.target).val())==-1) {
        $(e.target).addClass("error");
    }
    else {
        $(e.target).removeClass("error");
    }
})


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
$("html").on("click", "a", function (e) {
  if ($(e.target).hasClass("x")) {
    return;
  }
  e.preventDefault();
  rqst.post($(this).attr("href"), (resp) => {
    // console.log(resp);
    rqst.handler(resp);
  });
});


$("html").on("keydown", function (e) {
  if (e.altKey) {
    if (pagedata["shortcut"] == undefined) return;
    if (pagedata["shortcut"][e.key.toUpperCase()]) {
      let execx = pagedata["shortcut"][e.key.toUpperCase()];
      ext.exec(execx);
    } 
  }

});


$("html").on("click", ".xbtn", function (e) {
  if (e.target.hasAttribute("disabled")) return;
  if (this.hasAttribute("actionx")) {
    let parvar = $(this).attr("actionx").split(".");
    let dt = [];
    dt[parvar[0]] = parvar[1];
    dt["data"] = $(this).attr("dt"); 
    // console.log(dt);
    rqst.post(null, dt);
  }
  else if (this.hasAttribute("link")) {
    rqst.post($(this).attr("link"));
  }
  else if (this.hasAttribute("exec")) {
    ext.exec($(this).attr("exec"),e);
  }

});

$("html").on("click", function (e) {
  $(".cmenu").removeClass("active");
  hidecombo(e);
  if ($("menu-l").css("position") == "fixed") {
    if ($("menu-l").css("display") == "block") {
      if ($("x-bdy")[0].contains(e.target)) {
        $("menu-l").css("display", "none"); 
      }
    }
  }
  if ($("x-fav").css("display") == "block") {
    if ($("#xcontent")[0].contains(e.target)) {
      $("x-fav").css("display", "none"); 
    }
  }

});


$("html").on("click", ".lmenubtn", function (e) {
  
  if ($("menu-l").css("display")=="none") {
    $("menu-l").css("display", "block");
  }
  else {
    $("menu-l").css("display", "none");
  }
})

$("html").on("click", ".favbtn", function (e) {
  
  if ($("x-fav").css("display")=="none") {
    $("x-fav").css("display", "block");
  }
  else {
    $("x-fav").css("display", "none");
  }
})

$("html").on("contextmenu", "x-bdy", function (e) {
  if (e.altKey) return;
  let cmenu = $($("x-bdy").find(".cmenu")[0]);
  ext.showcmenu(cmenu,e);
})


$("html").on("focus", ".cmb", function (e) {
  if (e.target.hasAttribute("disabled") || e.target.hasAttribute("readonly")) return;
  combobox_render($(e.target));
  e.target.select();
})



$("html").on("change", "input", function (e) {
  let input = $(e.target);
    switch (input.attr("datatype")) {
      case "decimal":
        let inpx = ext.parsamt(input.val());
        if ($.isNumeric(inpx)) {
          // input.val((Math.round(input.val() * 100) / 100).toFixed(2));
          input.val(decimal(inpx));
        }
        else {
          
        }
        break;
    
      default:
        break;
    }
    // let datatype=
})


$("html").on("click",".w-tabx button", function (e) {
  $(".w-tabx button").removeClass("active");
  $(e.target).addClass("active");
})

$("html").on("click", ".sort", function (e) {
  let table = e.target.closest("table");
  let titlebar = e.target.closest("tr");
  let tds = $(titlebar).find("th");
  let colindex = tds.get().indexOf(e.target);
  ext.sortTable(table,colindex);
})

$("html").on("click", ".sorttag", function (e) {
  let table = e.target.closest("table");
  let titlebar = e.target.closest("tr");
  let tds = $(titlebar).find("th");
  let colindex = tds.get().indexOf(e.target);
  ext.sortTable(table,colindex,true,true);
})

$("html").on("click", ".sortx", function (e) {
  let table = e.target.closest("table");
  let titlebar = e.target.closest("tr");
  let tds = $(titlebar).find("th");
  let colindex = tds.get().indexOf(e.target);
  ext.sortTable(table,colindex,false);
})




function handleform(grpname, callback) {
  // let grpname = instr[1];
  let allpars = [];
  let inps = $("." + grpname);
  inps.removeClass("error");
  let error_count = 0;
  inps.each(function () {
    let finalInpValue = getInpVal($(this));
    allpars[$(this).attr("name")] = finalInpValue;
    error_count += input_validation($(this), finalInpValue);

  });
  if (error_count>0) {
    return;
  }

  if (allpars["app"] != undefined) {
    apps[allpars["app"]](allpars);
    return;
  }
  // console.log(pagedata[callback]);
  // console.log(callback);
  rqst.post(null, allpars, pagedata[callback]);
  // rqst.post(null, allpars,pagedata[callback]);
  

  console.log(allpars);

  function getInpVal(inp) {
    return inp.hasClass("cmb") ? getFinalComboVal(inp) : inp.val();
  }

  function input_validation(inp, finalval) {
    if ((finalval == null || finalval === "") && inp.attr("notnull") == 1) {
      inp.addClass("error");
      return 1;
    } 
    return 0;


    
  }



}


var cpu_usage = [];
function start(a) {
    const current = new Date();
    const currentTimeInMilliseconds = current.getTime();
    cpu_usage[a] = currentTimeInMilliseconds;
}

function end(a, adjust=0) {
    const current = new Date();
    const currentTimeInMilliseconds = current.getTime();
    const styles = ['color: orange', 'background: black'].join(';');
    // console.log('%c%s', styles, "    " + a + " : " + (currentTimeInMilliseconds - cpu_usage[a] - adjust) + "   ");
    return (currentTimeInMilliseconds - cpu_usage[a] - adjust);
}

function progress(n, color) {
    color = color?? "0, 150, 255";
    if (n<100) {
        color = "200,100,0";
    }
    //box-shadow: 2px 2px 4px 2px 
    $("#loaderx").css("width", n + "%");
    $("#loaderx").css("background","rgba("+color+",1)");
    $("#loaderx").css("box-shadow","0px 1px 6px 2px rgba("+color+",0.4)");
}

function showmodal() {
    $("modalx").css("display", "block");
    $("modalx .content").css("top", "120px");
    $("modalx .bgx").css("opacity", "0.1");

    setTimeout(() => {
        $("modalx .bgx").css("opacity", "1");
        $("modalx .content").css("top", "60px");
    }, 10);
    
    // delay(() => {
        
    // },1000)
}

function print(type, msg) {
    if (type == "cpu" || type=="rsp") {
        console.log(msg);
    }
}

// function split_by_non_alphanumeric_includedot(s) {
//     let sk =s.split(/[^A-Za-z1-9. ]/);
//     let aa = [];
//     for (const key in sk) {
//        if (sk[key]!="") {
//            aa.push(sk[key]);
//        }
//     }
//     return aa;
// }

function split_by_non_alphanumeric(s) {
    let sk =s.split(/[^A-Za-z1-9 ]/);
    let aa = [];
    for (const key in sk) {
       if (sk[key]!="") {
           aa.push(sk[key]);
       }
    }
    return aa;
}

function split_by_alphanumeric(s) {
    let sk = s.split(/[^<=>?!/]/);
    let aa = [];
    for (const key in sk) {
       if (sk[key]!="") {
           aa.push(sk[key]);
       }
    }
    return aa;
}


function removeduplicate_from_array(duplicateArray) {
    return duplicateArray.filter((elem, pos) => {
        return duplicateArray.indexOf(elem) === pos;
      });
} 



function firstRow_to_dic(arrx) {
    if (typeof(arrx[0])=="object") {
        return arrx[0];
    }
    return arrx;
}


function runafter(ms, funcx) {
    setTimeout(() => {
        funcx();
    }, ms);
}

function pop(layout) {
    console.log(layout);
    handleLayout({ pop:1 ,...layout});
}



function insertDevCode(response)
{
    //devcode
    if (window.location.pathname == response["url"]) {
        $("#dev_input").val(response["layout"]);
    }
    if (response["layout"]["pop"] != undefined) return;
    $("#dev_input").val(response["devcode"]);

}     

function asyncx(func) {
    setTimeout(func, 0);
}
function delay(func,ms) {
    setTimeout(ms,func);
}


function decimal(valx, place = 2) {
    try {
        valx=parseFloat(valx).toFixed(place);
        let x = Number(valx).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: place, maximumFractionDigits: 2 });
        return x;
    } catch (error) {
        return valx;
    }
   
    // let x = (Math.round(valx * 100) / 100).toFixed(2);
    // console.log(typeof Number(x));
    
}




// //layout: json layout data
// var tempCurrItem = "";
// function handleLayout(layout, container, data = [], scopedata = []) {
//   initilize_widgets(startlayout);
//   function startlayout() {
//     loadData();
//     let parent = container ?? $("x-bdy");
//     for (const type in layout) {
//       let typ = type.split(":");
//       let properties = layout[type];
//       let prop_id = typ[0].split(" ")[0];
//       tempCurrItem = type;
//       try {
    
//         switch (prop_id) {
//           case "clear":
//             parent.html("");
//             parent.removeAttr("style");
//             parent.removeAttr("class");
//             $("menu-t").html("");
//             $("x-pop .content").html("");
//             $("x-pop").css("display", "none");
//             break; 1
//           case "pop":
//             parent = $("x-pop .content");
//             parent.html("");
//             $("x-pop").css("display", "block");
//             break
//           case "redirect":
//             console.log("redirecting to home");
//             window.location.href = "/";
//             // rqst.post(properties);
//             break;
//           case "route":
//             console.log("Rerouting to " + properties);
//             history.pushState(null, '', properties);
//             rqst.post(properties);
//             break;
//           case "style":
//             if (typ[1].trim() == "def") {
//               parent.removeAttr("style");
//             }
//             w_style(properties, typ);
//             break;
//           case "parent":
//             w_parent(properties);
//             break;
//           case "run":
//             getVal("$ >>>"+properties);
//             break;
//           case "stop":
//             // console.log("stopped");
//             return;
//             break;
//           case "static":
//             if (parent.attr("st-atic") == properties.trim()) {
//               return;
//             }
//             else {
//               parent.html("");
//               parent.removeAttr("style");
//               parent.attr("st-atic", properties.trim());
//             }
//             break;
//           case "id":
//               addid(properties);
//               break;
//           case "class":
//             addclass(properties);
//             break;
//           case "attr":
//             addattr(properties, scopedata);
//             break;
//           case "data":
//             // console.log(typ[1]);
//             // data[typ[1].trim()] = properties;
//             break;
//           case "define":
//             w_define(properties.split(","));
//             break;
//           case "view":
//             w_view(properties, typ);
//             break;
//           case "widget":
//             // console.log(typ);
//             w_widget(properties, typ);
//             break;
      
//           default:
//             break;
//         }
//       } catch (error) {
//         console.log(type);
//         console.log(error);
//       }
//     }
   

//     // console.log(data);

//     function loadData() {
//       for (const type in layout) {
//         let typ = type.split(":");
//         if (typ[0]=="data") {
//           data[typ[1].trim()] = layout[type];
//         }
//       }
//     }

//     function w_style(properties, typ) {
//       if (typ[1] == "def") {
//         // console.log("resetting s");
//         $(parent).removeAttr("style");
//       }
//       for (const k in properties) {
//         parent.css(k, getVal(properties[k]));
//       }
//     }
//     function w_parent(properties) {
//       let arr_prop = properties.split("=");
//       let el_selector = arr_prop.length == 1 ? "#" : arr_prop[0] == "id" ? "#" : arr_prop[0] == "class" ? "." : "";
//       // console.log(">>>>>>>>",getVal((arr_prop.length == 1 ? arr_prop[0] : arr_prop[1])));
//       parent = $(el_selector + getVal((arr_prop.length == 1 ? arr_prop[0] : arr_prop[1])));
//     }

//     function w_define(properties) {
//       for (const key in properties) {
//         arr_prop = properties[key].split("=");
//         data[arr_prop[0].replace(" ", "")] = getVal(arr_prop[1]);
//       }
//     }

//     function addclass(properties) {
//       let clss = properties.trim().split(" ");
//       let output = "";
//       for (const key in clss) {
//         output += getVal(clss[key])+" ";
//       }
//       if (output.substring(0,1)!="@") $(parent).addClass(output);
//     }

//     function addid(properties) {
//       let output = getVal(properties.trim());
//       $(parent).attr("id",output);
//     }

//     function addattr(properties, scopedata) {
//       let attr = getVal(properties.trim(),scopedata).split(",");
//       for (const key in attr) {
//         let attrx = attr[key].split("=");
//         let valxattr = getVal(attrx[1], scopedata);
//        if (typeof(valxattr)=="string") {
//           if (valxattr.substring(0,1)!="@") {
//             $(parent).attr(attrx[0].trim(), valxattr);
//           }
//          return;
//        }
//        $(parent).attr(attrx[0].trim(), valxattr);
//       }
      
//     }

//     function w_view(properties, typ) {
//       // if ("args" in properties == false) return;
    
//       if ("x-data" in properties) {
//         let dt_x_data = getVal(properties['x-data']);
//         if (typeof dt_x_data != "object") { _create(); return; }
//         for (const key in dt_x_data) {
//           _create(dt_x_data[key]);
//         }
//       }
//       else {
//         _create();
//       }

//       function _create(add_data=[]) {
//         let argsx = { ...properties["args"] };
//         let vw_layout = $(view[typ[1].trim()](getVal(argsx, add_data)));
//         if ("x-parent" in properties) {
//           // console.log("#" + getVal(properties["x-parent"]));
//           $("#" + getVal(properties["x-parent"])).append(vw_layout);
//         }
//         else {
//           parent.append(vw_layout);
//         }
//         // console.log(parent);
//         overried_el_props(vw_layout,properties, add_data);
//       }


//     }

//     function w_widget(properties, typ) {
//       let wid_layout = getwidget(typ[1]);
//       if ("x-data" in properties) {

//         let dt_x_data = getVal(properties['x-data']);
//         if (typeof dt_x_data != "object") {  return; }
//         for (const key in dt_x_data) {
//           // console.log(dt_x_data[key]);
//           _create(dt_x_data[key]);
//         }
//       }
//       else {
//         _create();
//       }


//       function _create(add_data=[]) {
//         // let widget_el = $(`<div class="w-${typ[1]}" ></div>`);
//         let widget_el = $(`<div class="w-${typ[1]}" ></div>`);

//         // parent.append(widget_el);
//         add_view_to_dom(properties, widget_el);
//         //pending
//         let argsx = { ...properties["args"] };
//         handleLayout(wid_layout, widget_el, getVal(argsx, add_data));
//         overried_el_props(widget_el, properties,add_data);
        
//         if (widget_el.html()=="") {
//           widget_el.remove();
//         }
//       }
//     }
//     function overried_el_props(vwparent,props, add_data) {
//       let layx = [];
//       if ("x-style" in props) layx["style:ext"] = props["x-style"];
//       if ("x-class" in props) layx["class"] = props["x-class"];
//       if ("x-attr" in props) layx["attr"] = props["x-attr"];
//       handleLayout(layx, vwparent, data, add_data);
//       //from here
//     }
    
 

//     function add_view_to_dom(properties, el) {
//       // console.log(properties);
//       // console.log(properties);
//       if ("x-parent" in properties) {
//         $("#" + getVal(properties["x-parent"])).append(el);
//       }
//       else {
//         parent.append(el);
//       }


//       // if ("x-parent" in properties) {
//       //   console.log(properties);
//       //   // let arr_prop = properties.split("=");
//       //   // let el_selector = arr_prop.length == 1 ? "#" : arr_prop[0] == "id" ? "#" : arr_prop[0] == "class" ? "." : "";
//       //   // // console.log(">>>>>>>>",getVal((arr_prop.length == 1 ? arr_prop[0] : arr_prop[1])));
//       //   // parent = $(el_selector + getVal((arr_prop.length == 1 ? arr_prop[0] : arr_prop[1])));
//       // }
//       // else {
//       //   parent.append(el);
//       // }

//     }



//     function getVal(varname, additional_data = [],CanreturnObject=true, canreturnblank=false) {
//       // console.log(varname, typeof varname);
//       if (typeof(additional_data) != "object") { additional_data = [additional_data] };

      
//       if (typeof(varname) == "number") return varname;
//       else if (typeof(varname) == "object") return handlearray(varname);
//       else if (typeof(varname) == "boolean") return varname?1:0 ;
//       else if (varname.substring(0, 1) == "$") return handle_sentence(varname);
//       else if (varname.includes("[")) return resolve_val_from_array(varname);
//       else if (varname.substring(0, 1) != "@") return varname;
    
//       let _varname = varname.replace("@", "");
//       let result;
//       // if (_varname in additional_data == true) result = additional_data[_varname];
//       // console.log(varname,additional_data);
//       if (additional_data[_varname] != undefined) result = additional_data[_varname];
//       else if (data[_varname] != undefined) result = data[_varname];
//       if (varname == result) return result;
//       else return (result == undefined) ? varname : ((typeof (result) == "object") && CanreturnObject == false) ? varname : getVal(result) ;
//       // else return (result == undefined ) ? varname : getVal(result);
      

//       function resolve_val_from_array(varx) {
//         try {
//           let arr_varx = varx.replaceAll("]", "").split("[");
//           // console.log(varx);
//           return data[arr_varx[0].substring(1)][arr_varx[1]][arr_varx[2]];
        
//         } catch (error) {
//           console.log("Error : ", varx);
//           return "";
//         }
//       }

//       function handle_sentence(varx) {
//         // console.log(varx);
//         let arr_varx = varx.split("@");
//         let output = varx.substring(1);
//         for (let i = 1; i < arr_varx.length; i++) {
//           let km = arr_varx[i].split(" ")[0];
//           // console.log(km,  additional_data));
//           output = output.replace("@" + km, getVal("@" + km, additional_data,false,true))
//         }
//         output=output.replaceAll(" *-","")
//         // console.log("=========",output);
//         output = ReplaceExtValues(output);

//         return output;
//       }
//       function handlearray(varx) {
//         for (const k1 in varx) {
//           varx[k1] = getVal(varx[k1], additional_data);
//         }
//         return varx;
//       }


//       function ReplaceExtValues(varname,startindex=0) {
//         try {
//           let si = varname.indexOf(">>>");
//           if (si<startindex) {
//             return varname;
//           }
//           let ei = varname.indexOf(")", si)+1;
//           let strxmo = varname.substring(si, ei);
          
//           // let value=ext[]
//           let funcname = strxmo.split(">>>")[1].replace(")", "").split("(");

//           let parameters = funcname[1].split("*comma");
//           for (const key in parameters) {
//             if (typeof (parameters[key]) != "object") parameters[key] = parameters[key].trim();
//             if (parameters[key] == undefined) continue;
//             if (parameters[key].trim().substring(0, 1) == "@") {
//               parameters[key] = data[parameters[key].replace("@", "").trim()];
//             }
//           }
//           let value = ext[funcname[0]](...parameters);
//           return ReplaceExtValues(varname.replace(strxmo, value),si);
//         } catch (error) {
//           console.log(error);
//         } 
//       }
      
//     }





//   }
// }






// // //check function data scope behaviour
// // function main(data) {
// //   data = data + 1;
// //   console.log("data = " + data);
// //   if (data == 1) {
// //     main(2);
// //   }
// //   console.log("final data = "+ data);
// // }
// // main(0);

function handleLayout(layout, parent, data = [], clear = true) {
 
  if (data==null) {data=[];};
  if (layout == "") {
    parent = parent ?? $("x-bdy");
    $(parent).removeAttr("style");
    $(parent).removeAttr("class");
    let aa="<h2 class='redf pt-10 pl-10'>Unauthorized Access</h2>";
    aa+="<h3 class='greyf mt-4 pl-10'>For More Info</h3>";
    aa+="<h5 class='orangef mt-4 pl-10'>prajsnet@gmail.com</h5>";
    aa+="<a class='accent whitef round1 mt-4 ml-10 p-4' href='/'>< Navigate to Homepage</a>";

    $(parent).html(aa);
    $("x-r1panel").hide();
    return;
  }
  let _ = {};
  parent = parent ?? $("x-bdy");
  data["parent"] = parent; 
  if (clear && layout!=null) {
    parent.html("");
    parent.removeAttr("style");
    parent.removeAttr("Class");
    
  }
  Object.defineProperty(_, "style", {
    set(value) {
      console.log(parent);
      parent.attr("style", value);
    },
  });

  Object.defineProperty(_, "class", {
    set(value) {
      parent.attr("class", value);
    },
  });
  Object.defineProperty(_, "parent", {
    set(value) {
      parent = $(value);
    },
  });
  Object.defineProperty(_, "raw", {
    set(value) {
      parent.append(value);
    },
  });

  Object.defineProperty(_, "datapool", {
    set(value) {},
  });

  Object.defineProperty(_, "static", {
    set(value) {
      if (parent.attr("static-id") != value) {
        parent.html("");
        parent.removeAttr("style");
        parent.removeAttr("class");
        parent.attr("static-id", value);
      }
      else {
        throw "static";
      }
    },
  });

  Object.defineProperty(_, "pop", {
    set(value) {
      parent = $("x-pop .content");
      parent.html("");
      parent.removeAttr("style");
      $("x-pop").css("display", "block");
    }
  });

  Object.defineProperty(_, "view", {
    set(value) {
      try {
        // console.log(value);
        let xparent = value["parent"] != undefined ? $(value["parent"]) : parent;
        let vw = view[value["type"]](value);
        xparent.append(vw);
      } catch (error) {
        // console.log(value);
        // console.log(error);
        // console.log("error Creating VIEW "+ value["type"]);
      }
    },
  });
  Object.defineProperty(_, "widget", {
    set(value) {
      try {
        let widget = $(`<div></div>`);
        let xparent = value["parent"] != undefined ? $(value["parent"]) : parent;
        xparent.append(widget);
        value['parent'] = widget;

        // handleLayout(getwidget(value["type"]), widget, value);
        widx[value["type"]](handleLayout(null, widget, value), value);
        
        if (widget.html() == "") widget.remove();
        widget.addClass("w-" + value["type"]);
        applyAttr(widget, value);

      } catch (error) {
        if (error == "static") return;
        console.log("error Creating WIDGET " + value["type"]);
        console.log(error);
      }
    },
  });

  if (layout == null) return _;

  try {
    eval(layout);
   
  } catch (error) {
    // console.log("eval error");
    console.log(error);
  }

}


function applyAttr(widget, layout) {
    for (const key in layout) {
      switch (key) {
        case "class":
          widget.addClass(layout[key]);
          break;
        case "style":
          widget.attr("style",layout[key]);
          break;
        case "id":
          widget.attr("id",layout[key]);
          break;
        case "attr":
          for (const km in layout[key]) {
            if (layout[key][km] == undefined ) continue;
            widget.attr(km,layout[key][km]);
          }
          break;
      }
    }
} 


var cacheA = [];

function getvalue(key, key2) {
    // console.log(key);
    try {

        if (key2 == undefined) {
            return localStorage.getItem(key);
        }
        else {
            if (cacheA[key] == undefined) {
                cacheA[key] = JSON.parse(getvalue(key));
            }
            return cacheA[key][key2];
        }
                
    } catch (error) {
        return "";   
    }
}


function storeval(key,val) {
    localStorage.setItem(key,val);
}



var pagedata = [];


  


var jskey = "";
function hash(str, algo) {
    
    let hash = CryptoJS.SHA256(str);
    let hashHex = hash.toString(CryptoJS.enc.Hex);
    return hashHex;
}

var ajaxn = 0;
function processRawResponse(resp) {
    ajaxn++;
    let respx = JSON.parse(resp);
    let obj = JSON.parse(atob(respx["data"]));

    // console.log("data>>>>",obj);
    if (obj["jskey"]!=undefined) {
        jskey = obj["jskey"];
    }
    obj["sign_match"] = getsign(respx["data"]) == respx["sign"] ? 1 : 0;
    
    let colorx = "red";
    if (obj["sign_match"]==1) {
        colorx = "green";
    }
    
    console.log('%c%s', 'color: white; background: '+colorx+';', "  N"+end("transport-time", obj["exectime"])+"  S" + obj["exectime"]+" "+"=======  "+ajaxn+"  =======  ");
    
    return obj
}


function process_ajax_data(dt) {

    dt = { "timestamp": (new Date()).valueOf(), ...dt };
    
    let publickey = dt["publickey"] != undefined ? dt["publickey"] : getvalue("publickey");

    if (publickey != null) {
        dt["publickey"] = publickey;
        let base64x = btoa(JSON.stringify(dt));
        dt={sign: getsign(base64x), data: base64x };
    }
    else {
        let base64x = btoa(JSON.stringify(dt));
        dt={ data: base64x };
    }
    
   console.log(dt);
    return dt;
}


function getsign(base64x) {
    // console.log("new local key",jskey+getvalue("localkey"));
    return hash(base64x +jskey+getvalue("localkey"));
}



// function get_sorted_param(arr) {
//     let _outp="";
//     let arrkeys=Object.keys(arr).sort();
//     for (const key in arrkeys) {
//         _outp+=arrkeys[key]+"="+arr[arrkeys[key]]+"&";
//     }
//     return _outp;
    
// }




$("html").keydown(function (e) {
  // console.log(e.altKey, e.key);
  if (e.altKey && (e.key == "x" || e.key=='≈')) {
    e.preventDefault();
    if ($("dev-bdy").css("display") == "block") {
      $("dev-bdy").css("display", "none");
      storeval("devbdy", 0);
    } else {
      $("dev-bdy").css("display", "block");
      storeval("devbdy", 1);

    }
  }
});

function getViewStr(input, level) {

    // console.log(input, level);
    // console.log(langstr);
    if (langstr[input] != undefined) {
        if (langstr[input][level] != undefined) {
            return langstr[input][level];
        }
        else if(langstr[input][0]!= undefined) {
            return langstr[input][0];
        }
    }
    else {
        return input;
    }


}

var langstr = [];



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
$("html").on("click", ".link1 a", function (e) {
  let el = $(e.currentTarget);
  let grp = $(el).closest(".grp");
  $(grp).find(".link1 a").removeClass("active");
  el.addClass("active");
});

var a = 0;
const ext = {
  randid: (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    a++;
    return "a" + result + a;
  },
  getwidget: (wname) => {
    return getwidget(wname);    
  },
  randkey: (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:|<>?,.~";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  r1panel: (clear) => {
    if (clear) $("x-r1panel").html("");
    $("x-r1panel").append($($("x-bdy").find(".cmenux")).html());
  },
  handlelayout: (layout,parent,data,clear) => {
    handleLayout(layout,parent,data,clear)
  },
  autopad: () => {
    if ($("menu-l").html()!="") {
      $("menu-l").css("min-width", "200px");
      $("bd").css("padding-left","200px");
    }
    else {
      $("bd").css("padding-left","0px");
    }
    // $("x-bdy").css("padding-left", $("menu-l").width()+10);
    if ($("menu-t").css("position")!="sticky") {
      $("x-bdy").css("padding-top", $("menu-t").height());
    }
    $("x-fav").css("top", $("menu-t").height());

    $("menu-l").css("padding-top", $("menu-t").height() + 20);

    // if ($("x-pop").css("position")!="fixed") {
    //     $("x-pop").css("padding-top", $("menu-t").height() );
    //     $("x-pop").css("background", $("x-bdy").css("background-color"));

    // }
  },
  shortcut: (key, exec) => {
    if (pagedata["shortcut"] == undefined) pagedata["shortcut"] = {};
    pagedata["shortcut"][key] = exec;
  },
  exec: (str,e) => {
    let instr = str.split(".");
    switch (instr[0]) {
      case "run":
        // eval("ext." + instr[1]);
        ext[instr[1]]();
        break;
      case "handleform":``
        handleform(instr[1], instr[2]);
        break;
      case "logout":
        rqst.post(null, { rqtype: "subacc", data: "logout." + instr[1] });
        break;
      case "login":
        rqst.post(null, { rqtype: "subacc", data: "login." + instr[1] });
        break;
      
      case "link":
        let url = instr[1];
        let parent = str.split(".parent:")[1] ?? null;
        if (parent==null) {
          rqst.post(url);
          return;
        }
        parent = $("#" + parent);
        console.log(parent);
       
        rqst.post(url, null, (resp) => {
          console.log(parent);
          handleLayout(resp["layout"], parent,resp);
        });
      
        break;
      case "api":
        // console.log(instr[1]);
        rqst.post(null, pagedata[instr[1]],instr[2]!=undefined?pagedata[instr[2]]:null);
        break;1
      case "pop":
        rqst.post(instr[1], null, (resp) => {
          let prnt = $("x-pop .content");
          prnt.html("");
          handleLayout(resp["layout"], prnt, resp, false);
          $("x-pop").css("display", "block");
        });
        break;
      case "post":
        let parsx = instr[1].split(",");
        let datax = [];
        for (const key in parsx) {
          let par = parsx[key].split(":");
          datax[par[0]] = par[1];
        }
        rqst.post(null, datax, (resp) => {
          // console.log(resp);
          rqst.handler(resp);
        });
        break;
      default:
        pagedata[instr[0]](e);
        break;
    }
  },
  refresh: () => {
    rqst.post();
  },
  lmenu_auto_active: () => {
    $("[href='" + window.location.pathname + "']").addClass("active");
  },
  icon: (iconame, color, size, thickness) => {
    if (iconame == undefined) return "";
    let attr =
      size != undefined
        ? " width='" + size + "'" + " height='" + size + "'" + ""
        : "";
    attr += thickness != undefined ? ' stroke-width="' + thickness + '"' : "";
    attr += color != undefined ? ' color="' + color + '"' : "";
    // console.log(attr);
    // console.log(`<i ${attr} data-feather="${iconame.trim()}"></i>`);
    let icon = `<i ${attr} data-feather="${iconame.trim()}"></i>`;
    // console.log(icon);
    return icon;
  },
  getvalue: (k1, k2) => {

    return getvalue(k1.trim(), k2.trim());
  },
  buildtree: (treeid, data, id, hid, descp) => {
    App_buildtree(treeid, data, id, hid, descp);
  },
  if: (k, iftrue, iffalse) => {
    if (eval(k)) {
      return iftrue;
    } else {
      return iffalse;
    }
  },
  ifequals: (left, right, ontrue, onfalse) => {
    if (right == "undefined") right = undefined;
    if (left == right) {
      return ontrue;
    } else {
      return onfalse;
    }
  },
  popclose: () => {
    $("x-pop").css("display", "none");
    $("x-pop .content").html(" ");
  },
  decimal: (vv,place) => {
    return decimal(vv,place);
  },
  thememode: (mode) => {
    if (mode==undefined) {
      mode = getvalue("thememode")==1?0:1;
    }
    let selc = mode == 0 ? "root_dark" : "root_light";
    $(":root").removeClass("root_dark");
    $(":root").removeClass("root_light");
    storeval("thememode", mode);
    $(":root").addClass(selc);
    console.log(mode);
  },
  combobox: (data, formid, inpname, txt, id, defaultval = null, rowid, newopt) => {
    combobox(data, formid, inpname, txt, id, defaultval = null, rowid, newopt)
  },
  showcmenu: (cmenu, e) => {
    $(".cmenu").removeClass("active");
    if (cmenu.length == 1) {
      e.preventDefault();
      $(cmenu).addClass("active");
    }
    var offset = cmenu.offset();
    cmenu.offset({ left: e.pageX, top: e.pageY });
  },
  showwidgetcode: (widgetname) => {
    // // getwidget(typ[1])
    // let newlayout = "style:def\n";
    // newlayout += "clear:1\n";

    // newlayout += "view:tv\n";
    // newlayout += "args: txt=hello";

    let widi = [];
    widi["view:tv"] = { args: { txt: JSON.stringify(getwidget(widgetname)) } };
    // console.log(widi);

    pop(widi);
  },
  today: (aY, aM, aD) => {
    return today(aY, aM, aD);
  },
  datexser:(date)=>{
    return datexser(date);
  },
  dateformat:(date) => {
    return format(date);
  },
  dateToval:(vall) => {
    return dateToval(vall);
  },
  dateToUnix:(vall)=>{
    return dateToUnix(vall);
  },
  valTodate: (val) => {
    return valTodate(val);
  },
  
  parsamt: (amt) => {
    console.log(amt);
    return amt.replaceAll(",","");
  },
  redirect: (url,parent, updateurl=false) => {
    rqst.post(url, null, (resp) => {
      handleLayout(resp.layout,parent);
    rqst});
  },
  popop: (layouts,callback) => {
    $("x-pop .content").html("");
    if (typeof(layouts)=="string") {
      rqst.post(layouts,null,(resp)=>{
        $("x-pop").show();
        handleLayout(resp["layout"],$("x-pop .content"),[],false);
        if (callback!=undefined) {
          callback();
        }
      });
      
      return;
    }
    let ldds = ext.randid(5);
    _ = handleLayout();
    _.pop = 1;
    _.view = { type: "container", id: ldds };
    _.parent = "#" + ldds;
    layouts(_);
  },

  showmodal: () => {
    showmodal();
  },
  textbtwn: (inp,pre,suf,start=0,maxlen=500) => {
    let si = inp.indexOf(pre, start);
    let ei = inp.indexOf(suf, si);
    // console.log(si, ei);
    if (ei==-1 ||si==-1) {
      return "";
    }
    if (ei-si-pre.length>maxlen) {
      ext.textbtwn(inp, pre, suf, ei, maxlen);
    }
    else {
      return inp.substring(si+pre.length, ei).trim();
    }
  },
  refresh:(sec,urlm,data)=>{
    setTimeout(() => {
      rqst.post(urlm,data,(resp)=>{
        rqst.handler(resp,false);
        // autorefresh(sec,urlm,data);
      })
    }, sec);
  },
  sortTable:(table,index,isnumber=true, usetag=false)=> {
    var rows, switching, i, x, y, shouldSwitch;
    let header = table.rows;
    let hrow = header[0].getElementsByTagName("TH")[index];
    let direction = "ASC";
    if ($(hrow).hasClass("asc")) {
      direction = "DESC";
      $(header[0]).find("th").removeClass("desc");
      $(header[0]).find("th").removeClass("asc");
      $(hrow).removeClass("asc");
      $(hrow).addClass("desc");
    }
    else {
      $(header[0]).find("th").removeClass("desc");
      $(header[0]).find("th").removeClass("asc");
      $(hrow).removeClass("desc");
      $(hrow).addClass("asc");
    }
    
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        if (usetag) {
          x = rows[i].getElementsByTagName("TD")[index].getElementsByClassName("sortval")[0];
          y = rows[i + 1].getElementsByTagName("TD")[index].getElementsByClassName("sortval")[0];
        }
        else{
          x = rows[i].getElementsByTagName("TD")[index];
          y = rows[i + 1].getElementsByTagName("TD")[index];
        }
       
        if (isnumber) {
   
          if (direction=="ASC") {
            
            if (Number(x.innerHTML.replaceAll(",","")) < Number(y.innerHTML.replaceAll(",",""))) {
              shouldSwitch = true;
              break;
            }
          }
          else {
            if (Number(x.innerHTML.replaceAll(",","")) > Number(y.innerHTML.replaceAll(",",""))) {
              shouldSwitch = true;
              break;
            }
          }


          
        }
        else {
          if (direction == "ASC") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }
          else {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
   
    // $(colt).addClass();

  },
  
  AllWidgets: () => {
    return AllWidgets;
  },

  
  randomcolor:()=>{
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    if (r+g+b < 200) {
      return ext.randomcolor();
    }
    return "rgb(" + r + "," + g + "," + b + ")";
 }


};

if (getvalue("thememode")!=null) {
    ext.thememode(getvalue("thememode"));
}
else {
    ext.thememode(0);
}


if (getvalue("devbdy") == 1) {
    runafter(500, () => {
        $("dev-bdy").css("display", "block");
    })
}





// var widgets_list = [~:widgetsname:~];
// function getwidget(widgetname) {
    
//     switch (widgetname) {
//         ~:widgets:~
//         default:
//             return ""
//     }

// }

var AllWidgets;
var Alldbs;
function getwidget(id) {
    return AllWidgets[id];
}

// function initilize_widgets(callback) {
//     console.log("initilizing widgets");
//     if (AllWidgets == undefined) {
//         rqst.post(null, { rqtype: "init"
//         }, function (resp) {
//             AllWidgets = resp["widgets"];
//             Alldbs = resp["dbs"];
//             callback();
//         })
//     }
//     else {
//         callback();
//     }
// }

// getwidget("test1");
$(document).ready(function () {
    
    try {
        CryptoJS
    } catch (error) {
        return;
    }
    
    rqst.post(null, { apid: "init" }, (resp) => {
        AllWidgets = resp["widgets"];
        Alldbs = resp["dbs"];
        initothertoolds();
        rqst.handler(resp);
        rqst.post(null);


    })

    function initothertoolds() {
        let htmxa = "";
        if (window.location.href.includes("db")) {
            htmxa += `<div style="margin-top:2px"><button exec='post.rqtype:db_make' class="xbtn fillh redbg whitef">MAKE</button></div>`;
            for (const key in Alldbs) {
                htmxa += `<div style="margin-top:2px"><a class='btn' href='/db/${key}' class="fillh">${key}</a></div>`;
            }
        }
        else {
            for (const key in AllWidgets) {
                htmxa += `<div style="margin-top:2px"><a class='btn' href='/widgets/${key}' class="fillh">${key}</a></div>`;
              
            }
        }
  
        $("#widgetlist").html(htmxa);
    }


});
  







// function initilize_widgets(callback) {
//     if (AllWidgets == undefined) {
//         // console.log("requesting widgets");
//         rqst.post(null, {
//             rqtype: "getwidgets"
//         }, function (resp) {
//             AllWidgets = resp["widgets"];
//             Alldbs = resp["dbs"];

//             callback();
//         })
//     }
//     else {
//         callback();
//     }
// }


// getwidget("test1");
// $(document).ready(function(){
//     initilize_widgets(() => {
//         rqst.post(null, { "rqtype": "init" });
//         let htmxa = "";
//         if (window.location.href.includes("db")) {
//             htmxa += `<div style="margin-top:2px"><button data-ex='rqtype:db_make' class="fillh redbg whitef">MAKE</button></div>`;
//             for (const key in Alldbs) {
//                 htmxa += `<div style="margin-top:2px"><a class='btn' href='/db/${key}' class="fillh">${key}</a></div>`;
//             }
//         }
//         else {
//             for (const key in AllWidgets) {
//                 htmxa += `<div style="margin-top:2px"><a class='btn' href='/widgets/${key}' class="fillh">${key}</a></div>`;
              
//             }
//         }
  
//         $("#widgetlist").html(htmxa);
//     });

//   });



 const widx={testwidget:(_,data)=>{alert("this is test widget")},iconview:(_,data)=>{_.view = { type: "container", id: "x", class: "imgx", style: `height:${data.height}; width:${data.width};  background-image: url('${data.icon}')` };},};
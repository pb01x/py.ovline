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
  // autopad: () => {
  //   if ($("menu-l").html()!="") {
  //     $("menu-l").css("min-width", "200px");
  //     $("bd").css("padding-left","200px");
  //   }
  //   else {
  //     $("bd").css("padding-left","0px");
  //   }
  //   // $("x-bdy").css("padding-left", $("menu-l").width()+10);
  //   if ($("menu-t").css("position")!="sticky") {
  //     $("x-bdy").css("padding-top", $("menu-t").height());
  //   }
  //   $("x-fav").css("top", $("menu-t").height());

  //   $("menu-l").css("padding-top", $("menu-t").height() + 20);

  //   // if ($("x-pop").css("position")!="fixed") {
  //   //     $("x-pop").css("padding-top", $("menu-t").height() );
  //   //     $("x-pop").css("background", $("x-bdy").css("background-color"));

  //   // }
  // },
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

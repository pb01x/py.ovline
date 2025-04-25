
const apps = {
    login: (allpars) => {

        let publickey=ext.randid(64);
        let pswd=hash(allpars["password"]);
        let timestamp=(new Date()).valueOf();
        let localkey = hash(pswd + publickey) + "-" + timestamp;


        console.log("pswd",   pswd);
        console.log("publickey",   publickey);
        console.log("join",pswd + publickey);
        
        console.log("localkey",localkey);
        
      
        // console.log("locakkey js ",localkey);

        storeval("localkey",localkey);

        let parx=[];
        parx["timestampx"]=timestamp;
        parx["fun"]="loginsubmit";
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


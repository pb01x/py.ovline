

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



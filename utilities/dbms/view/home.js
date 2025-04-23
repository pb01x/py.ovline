
_.roles = "public:current";
_.class = "lh";

_.include = "/snippets/leftmenu";

_.view={id:"tabledataviewer", type:"container",style:" min-height:600px; min-width:800px;"}

pagedata["loaddata"] = (e) => {
    let tablename = $(e.target).attr("x-data");
    $("#tabledataviewer").html("");
    rqst.post(null, { tablename: tablename }, (resp) => {
        _.widget = { type: "tableviewer", parent: "#tabledataviewer", data: resp[tablename], class:"px-4" ,style: "margin-top:20px; background:white;  " };
    })
}



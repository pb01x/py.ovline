_.roles = "public:current";
_.style = "background: #8844aa33;display:flex; ";
_.class = "lh";

let d2=ext.randid(10);


_.view = {type: "container",id: d2,  style: "background : #00000033; padding: 10px; margin:14px; width:300px; border-radius:10px;"};
_.view = {type: "container",id: "containerlogin", parent:"#"+d2, class:"lh",  style: " padding: 20px; margin:auto; border-radius:10px;"};
_.parent="#containerlogin";
_.view = {type: "container",id: "headerxs",  class:"lh",  style: " margin:auto; border-radius:10px;"};
_.widget={ type:'iconview',parent: "#headerxs", height:'60px', width:'120px',icon:'sf/icons/ovx.png'};
_.view = { type: "tv", parent: "#headerxs", txt: "TOOLS", class: "h2 pt-6", style: "opacity:0.6" };

_.view = { type: "container", id: "toolsx", parent:"#"+d2, class:"py-10",  style: " " };


_.parent="x-bdy";
_.view = { type: "container", id: "pnlxx", class:"nosb", style: "height:100vh; width:200px; overflow-x:hidden; overflow-y:scroll;" };
_.view = { type: "container", id: "bdy_widgetlist", parent:"#pnlxx", class:"py-10",  style: " " };
_.view = { type: "container", id: "detailbdy",  class:"p-10 blackbg whitef ml-10",  style: "width:100%; " };
_.view = { type: "container", id: "uicode", parent:"#detailbdy", class:"p-10 blackbg whitef ",  style: "width:100%; " };
_.view = { type: "container", id: "codex", parent:"#detailbdy", class:"p-10 blackbg whitef ",  style: "width:100%; color:orange; opacity:0.8;" };


_.parent="#toolsx";
_.view={type:"btn", id:"buildmain", txt:"UPDATE MAIN JS, CSS", class:"xbtn",attr:{exec: `mainjs` }};
_.view={type:"btn", id:"buildmain", txt:"color generator", class:"xbtn mt-2",attr:{exec: `link./admin/colors` }};


_.parent="#uicode";
_.raw=`<dev-bdyx style=" background: rgb(49, 49, 49); margin: 0px; left: 0px; bottom: 0px; width: 100%; display: block;">
        <div class="lh p-2" style="height: 200px;">
            <textarea id="dev_input" spellcheck="false" class="p-4" style="  color: white; height: 100%; padding: 20px; border: 0;  width: 100%; background-color: rgba(0, 0, 0, 0.911); "> _.widget</textarea>
        </div>
    </dev-bdyx>`;
_.parent="#bdy_widgetlist";
let widgets = ext.AllWidgets();
for (const key in widgets) {
    _.view = {type:"btn",txt:key, attr:{exec: `widgetDetail` }, class:"whitef xbtn block", style:"width:100%; border-radius:0px; font-size:0.9rem; text-align:left; margin:1px; background: #00000033; opacity:0.8;" };
}

pagedata["widgetDetail"]=(e)=>{
    let widgetname=$(e.target).html();
    $("#codex").html(widgets[widgetname]);
}

pagedata["mainjs"]=(e)=>{
    rqst.post(null, {apix:"sys.build_mainjs"}, (res) => {
        if (res["res"]==1) {
            $("#buildmain").addClass("greenbg whitef");
        }
    });
}

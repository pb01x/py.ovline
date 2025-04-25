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
                case "redirect":
                    setTimeout(() => {
                        ext.redirect(response[key]);
                    }, 500);
                    break
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
            // ext.autopad();
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



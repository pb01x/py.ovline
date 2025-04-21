
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
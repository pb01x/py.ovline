
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
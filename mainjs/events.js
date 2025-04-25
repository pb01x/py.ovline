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

$("html").on("submit", "form", (e) => {
  e.preventDefault();
  let arrdt = $(e.target).serializeArray();
  let arrx = [];
  for (const key in arrdt) {
    arrx[arrdt[key]["name"]] = arrdt[key]["value"];
  }
  rqst.post("", arrx, (resp) => {
    console.log(resp);
  })
})

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





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
  Object.defineProperty(_, "help", {
    set(value) {
      parent.append("");
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
$("html").keydown(function (e) {
  // console.log(e.altKey, e.key);
  if (e.altKey && (e.key == "x" || e.key=='≈')) {
    e.preventDefault();
    if ($("dev-bdy").css("display") == "block") {
      $("dev-bdy").css("display", "none");
      storeval("devbdy", 0);
    } else {
      $("dev-bdy").css("display", "block");
      storeval("devbdy", 1);

    }
  }
});

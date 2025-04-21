function handleform(grpname, callback) {
  // let grpname = instr[1];
  let allpars = [];
  let inps = $("." + grpname);
  inps.removeClass("error");
  let error_count = 0;
  inps.each(function () {
    let finalInpValue = getInpVal($(this));
    allpars[$(this).attr("name")] = finalInpValue;
    error_count += input_validation($(this), finalInpValue);

  });
  if (error_count>0) {
    return;
  }

  if (allpars["app"] != undefined) {
    apps[allpars["app"]](allpars);
    return;
  }
  // console.log(pagedata[callback]);
  // console.log(callback);
  rqst.post(null, allpars, pagedata[callback]);
  // rqst.post(null, allpars,pagedata[callback]);
  

  console.log(allpars);

  function getInpVal(inp) {
    return inp.hasClass("cmb") ? getFinalComboVal(inp) : inp.val();
  }

  function input_validation(inp, finalval) {
    if ((finalval == null || finalval === "") && inp.attr("notnull") == 1) {
      inp.addClass("error");
      return 1;
    } 
    return 0;


    
  }



}

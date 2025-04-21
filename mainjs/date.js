var z = 0;

var dateformat = ["y", "m", "d"];
var dateseparator = "-";

function today(aY, aM, aD) {
    let date = new Date();
    if(aD) date.setDate(date.getDate() + aD);
    if (aM) { date.setMonth(date.getMonth() + aM); };
    if(aY) date.setFullYear(date.getFullYear() + aY);
    // console.log(date);
    return format(date);
}



function format(date) {
    // date = new Date(date);
    datex = [];
    datex["d"] = ('0' + date.getDate()).slice(-2);
    datex["m"] = ('0' + (date.getMonth() + 1)).slice(-2);
    datex["y"]= date.getFullYear();

    let final = [];
    for (const key in dateformat) {
        final.push(datex[dateformat[key]]);
    }
    return final.join(dateseparator);
}


//get 20240722 format
function datexser(b) {
    let datarr = b.split(dateseparator);
    let datexx = [];

    for (const key in dateformat) {
        datexx[dateformat[key]] = datarr[key];
    }
    //console.log(new Date(datexx["y"], datexx["m"], 0).getDate());
    if (datexx["m"]>12) {
        return -1;
    }
    else if (new Date(datexx["y"], datexx["m"], 0).getDate()<datexx["d"]) {
        return -1;
    }

    if (([Number(datexx["y"]),Number(datexx["m"]),Number(datexx["d"])]).includes(0)) {
        return -1;
    }
    const datenew=new Date(datexx["y"],datexx["m"],datexx["d"]);
    // console.log("y",datenew.getMonth());
    let month=datenew.getMonth()<10?"0"+datenew.getMonth():datenew.getMonth();
    let day=datenew.getDate()<10?"0"+datenew.getDate():datenew.getDate();

    return datenew.getFullYear().toString()+month+day;
}


function dateToval(b) {
    const msday = 1000 * 60 * 60 * 24;
    let datarr = b.split(dateseparator);
    let datexx = [];
    for (const key in dateformat) {
       
        datexx[dateformat[key]] = datarr[key];
    }
    // console.log(new Date(datexx["y"], datexx["m"], 0).getDate());
    if (datexx["m"]>12) {
        return -1;
    }
    else if (new Date(datexx["y"], datexx["m"], 0).getDate()<datexx["d"]) {
        return -1;
    }

    if (([Number(datexx["y"]),Number(datexx["m"]),Number(datexx["d"])]).includes(0)) {
        return -1;
    }


    const utca = Date.UTC(2000, 1, 1);
    const utcb = Date.UTC(datexx["y"], datexx["m"], datexx["d"]);

    return Math.floor((utcb - utca) / msday);
}




function dateToUnix(b) {
    let datarr = b.split(dateseparator);
    let datexx = [];

    for (const key in dateformat) {
        datexx[dateformat[key]] = datarr[key];
    }
    // console.log(new Date(datexx["y"], datexx["m"], 0).getDate());
    if (datexx["m"]>12) {
        return -1;
    }
    else if (new Date(datexx["y"], datexx["m"], 0).getDate()<datexx["d"]) {
        return -1;
    }

    if (([Number(datexx["y"]),Number(datexx["m"]),Number(datexx["d"])]).includes(0)) {
        return -1;
    }
    const datenew=new Date(datexx["y"],datexx["m"]-1,datexx["d"]);

    // console.log(datexx);
    // console.log(datenew);
    
    return Math.round(Date.parse(datenew) / 1000);
}

function valTodate(c) {
    const msday = 1000 * 60 * 60 * 24;
    const utca = Date.UTC(2000, 1, 1);
    let aa = c * msday + utca;
    let date = new Date(aa);
    datttt = [];
    datttt["y"] = date.getFullYear();
    datttt["m"] = date.getMonth();
    datttt["d"] = date.getDay();
    let finaldate = [];
    for (const key in dateformat) {
        let dhujsa = datttt[dateformat[key]];
        finaldate.push(dhujsa<10?"0"+dhujsa:dhujsa);
    }
    return finaldate.join(dateseparator);
}


$("html").on("keydown", ".date", function (e) {

    let vv = $(e.target).val();
    let im = e.target.selectionStart;
    
    if (e.which == 37 || e.which == 39) {

    }
    else if (e.which == 8) {
        e.preventDefault();
        let x = e.target.selectionStart;
        if (x==0) {
            return;
        }
        if (vv.substring(x - 1, x) == dateseparator) {
            e.target.setSelectionRange(x - 1, x - 1);
            return;
        }
        $(e.target).val(vv.substring(0, x-1) + " " + vv.substring(x, vv.length));
        e.target.setSelectionRange(x-1, x-1)
        
    }
    else if (im >= 10) {
        e.preventDefault(); return;
    }
    else  if ((e.which >= 48 && e.which <= 57) || e.which >= 96 && e.which <= 105) {
        let i = e.target.selectionStart;
        if (vv.substring(im,im+1)=="-") {
            i++;
        }
        e.target.setSelectionRange(i, i + 1);

    } 
    else {
        // console.log(e.which);
        e.preventDefault();
    }

  

    // console.log(e.target);
})


$("html").on("keyup", ".date", function (e) {
    // if (!$.isNumeric(e.key)) {
    let input = e.target;
    let vv = $(input).val();
    if (e.which == 37) {
        let x = input.selectionStart;
        let nxtchar = vv.substring(x, x + 1);
        if (nxtchar==dateseparator) {
            input.setSelectionRange(input.selectionStart, input.selectionStart-1);
        }
    }
    else if(e.which==39 ) {
        
    }
    else if (e.which == 8) {
        
        
    }
    else {
        // console.log(e.which);
        let x = input.selectionStart;
        let nxtchar = vv.substring(x, x + 1);
        if (nxtchar==dateseparator) {
            input.setSelectionRange(input.selectionStart+1, input.selectionStart+1);
        }
    }
    if ( dateToval($(e.target).val())==-1) {
        $(e.target).addClass("error");
    }
    else {
        $(e.target).removeClass("error");
    }
})


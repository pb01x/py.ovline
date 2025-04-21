
var cpu_usage = [];
function start(a) {
    const current = new Date();
    const currentTimeInMilliseconds = current.getTime();
    cpu_usage[a] = currentTimeInMilliseconds;
}

function end(a, adjust=0) {
    const current = new Date();
    const currentTimeInMilliseconds = current.getTime();
    const styles = ['color: orange', 'background: black'].join(';');
    // console.log('%c%s', styles, "    " + a + " : " + (currentTimeInMilliseconds - cpu_usage[a] - adjust) + "   ");
    return (currentTimeInMilliseconds - cpu_usage[a] - adjust);
}

function progress(n, color) {
    color = color?? "0, 150, 255";
    if (n<100) {
        color = "200,100,0";
    }
    //box-shadow: 2px 2px 4px 2px 
    $("#loaderx").css("width", n + "%");
    $("#loaderx").css("background","rgba("+color+",1)");
    $("#loaderx").css("box-shadow","0px 1px 6px 2px rgba("+color+",0.4)");
}

function showmodal() {
    $("modalx").css("display", "block");
    $("modalx .content").css("top", "120px");
    $("modalx .bgx").css("opacity", "0.1");

    setTimeout(() => {
        $("modalx .bgx").css("opacity", "1");
        $("modalx .content").css("top", "60px");
    }, 10);
    
    // delay(() => {
        
    // },1000)
}

function print(type, msg) {
    if (type == "cpu" || type=="rsp") {
        console.log(msg);
    }
}

// function split_by_non_alphanumeric_includedot(s) {
//     let sk =s.split(/[^A-Za-z1-9. ]/);
//     let aa = [];
//     for (const key in sk) {
//        if (sk[key]!="") {
//            aa.push(sk[key]);
//        }
//     }
//     return aa;
// }

function split_by_non_alphanumeric(s) {
    let sk =s.split(/[^A-Za-z1-9 ]/);
    let aa = [];
    for (const key in sk) {
       if (sk[key]!="") {
           aa.push(sk[key]);
       }
    }
    return aa;
}

function split_by_alphanumeric(s) {
    let sk = s.split(/[^<=>?!/]/);
    let aa = [];
    for (const key in sk) {
       if (sk[key]!="") {
           aa.push(sk[key]);
       }
    }
    return aa;
}


function removeduplicate_from_array(duplicateArray) {
    return duplicateArray.filter((elem, pos) => {
        return duplicateArray.indexOf(elem) === pos;
      });
} 



function firstRow_to_dic(arrx) {
    if (typeof(arrx[0])=="object") {
        return arrx[0];
    }
    return arrx;
}


function runafter(ms, funcx) {
    setTimeout(() => {
        funcx();
    }, ms);
}

function pop(layout) {
    console.log(layout);
    handleLayout({ pop:1 ,...layout});
}



function insertDevCode(response)
{
    //devcode
    if (window.location.pathname == response["url"]) {
        $("#dev_input").val(response["layout"]);
    }
    if (response["layout"]["pop"] != undefined) return;
    $("#dev_input").val(response["devcode"]);

}     

function asyncx(func) {
    setTimeout(func, 0);
}
function delay(func,ms) {
    setTimeout(ms,func);
}


function decimal(valx, place = 2) {
    try {
        valx=parseFloat(valx).toFixed(place);
        let x = Number(valx).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: place, maximumFractionDigits: 2 });
        return x;
    } catch (error) {
        return valx;
    }
   
    // let x = (Math.round(valx * 100) / 100).toFixed(2);
    // console.log(typeof Number(x));
    
}



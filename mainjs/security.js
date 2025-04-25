
var jskey = "";
function hash(str, algo) {
    
    let hash = CryptoJS.SHA256(str);
    let hashHex = hash.toString(CryptoJS.enc.Hex);
    return hashHex;
}

var ajaxn = 0;
function processRawResponse(resp) {
    ajaxn++;
    let respx = JSON.parse(resp);
    let obj = JSON.parse(atob(respx["data"]));

    // console.log("data>>>>",obj);
    if (obj["jskey"]!=undefined) {
        jskey = obj["jskey"];
    }
    obj["sign_match"] = getsign(respx["data"]) == respx["sign"] ? 1 : 0;
    
    let colorx = "red";
    if (obj["sign_match"]==1) {
        colorx = "green";
    }
    
    console.log('%c%s', 'color: white; background: '+colorx+';', "  N"+end("transport-time", obj["exectime"])+"  S" + obj["exectime"]+" "+"=======  "+ajaxn+"  =======  ");
    
    return obj
}


function process_ajax_data(dt) {

    dt = { "timestamp": (new Date()).valueOf(), ...dt };
    
    let publickey = dt["publickey"] != undefined ? dt["publickey"] : getvalue("publickey");

    if (publickey != null) {
        dt["publickey"] = publickey;
        let base64x = btoa(JSON.stringify(dt));
        dt={sign: getsign(base64x), data: base64x };
    }
    else {
        let base64x = btoa(JSON.stringify(dt));
        dt={ data: base64x };
    }
    
   console.log(dt);
    return dt;
}


function getsign(base64x) {
    // console.log("new local key",jskey+getvalue("localkey"));
    console.log("jskey",jskey);
    return hash(base64x +jskey+getvalue("localkey"));
}



// function get_sorted_param(arr) {
//     let _outp="";
//     let arrkeys=Object.keys(arr).sort();
//     for (const key in arrkeys) {
//         _outp+=arrkeys[key]+"="+arr[arrkeys[key]]+"&";
//     }
//     return _outp;
    
// }




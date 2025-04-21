

var cacheA = [];

function getvalue(key, key2) {
    // console.log(key);
    try {

        if (key2 == undefined) {
            return localStorage.getItem(key);
        }
        else {
            if (cacheA[key] == undefined) {
                cacheA[key] = JSON.parse(getvalue(key));
            }
            return cacheA[key][key2];
        }
                
    } catch (error) {
        return "";   
    }
}


function storeval(key,val) {
    localStorage.setItem(key,val);
}



var pagedata = [];


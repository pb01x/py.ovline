function getViewStr(input, level) {

    // console.log(input, level);
    // console.log(langstr);
    if (langstr[input] != undefined) {
        if (langstr[input][level] != undefined) {
            return langstr[input][level];
        }
        else if(langstr[input][0]!= undefined) {
            return langstr[input][0];
        }
    }
    else {
        return input;
    }


}

var langstr = [];


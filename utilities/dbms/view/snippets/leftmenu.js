
let tablelist = [];
for (const key in data.tablelist) {
    let tablename = data.tablelist[key][0];
    tablelist.push({ txt: tablename, "x-data":tablename, exec: "loaddata"   })
}


_.widget = { id:"lmenux", parent:"menu-l", type: "listviewer", class: "leftmenu", data: tablelist, style: "padding-top:60px; width:200px; height:100%; background: #1e4b91; color:white;" }



$('#lmenux').on('change', function() {
    if ($(this).val() === 'value1') {
        console.log("changes");
    } else {
        console.log("changes");
      
    }
});
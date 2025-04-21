if (getvalue("thememode")!=null) {
    ext.thememode(getvalue("thememode"));
}
else {
    ext.thememode(0);
}


if (getvalue("devbdy") == 1) {
    runafter(500, () => {
        $("dev-bdy").css("display", "block");
    })
}



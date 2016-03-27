

$('.share').click(function(event) {
    event.preventDefault();
    var winWidth = 500;
    var winHeight= 500;
    var winTop = 0;
    var winLeft = 0;
    window.open(
        $(this).attr('href'),
        'share',
        'top=' + winTop + ',left=' + winLeft + ',' +
        'toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight
    );
});


$( ".about" ).click(function() {
    $('#about-dialog').dialog('open');
    AlFehrestNS.HelpEngine.close();
});

$( ".help" ).click(function() {
    AlFehrestNS.HelpEngine.start();
});

$('#about-dialog').dialog({
    autoOpen: false,
    modal: true,
    maxWidth:600,
    maxHeight: 500,
    width: 600,
    height: 500,
    title: "نموذج تفاعلي لأنساب العرب في السيرة النبوية",
    buttons: {
        "العودة" : function() {
            $('#about-dialog').dialog('close');
        }
    }
});




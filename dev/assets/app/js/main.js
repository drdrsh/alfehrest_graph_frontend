

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

$('#menu').click(function(){
    $('#top-panel').toggleClass("is-slid");
    $('#menu a').toggleClass("open");
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
    title: "Visualization of artificial neural networks",
    buttons: {
        "Take a tour" : function() {
            $('.help').click()
            $('#about-dialog').dialog('close');
        },
        "Build your own Network" : function() {
            $('#about-dialog').dialog('close');
            if($('#menu .open').length == 0){
                $('#menu').click();
            }
        }
    }
});
$('#about-dialog').dialog('open');

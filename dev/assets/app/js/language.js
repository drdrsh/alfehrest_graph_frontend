AlFehrestNS.loadLanguage = function(lang) {

    $.getScript( "assets/app/language/"+lang+".js" )
        .done(function( script, textStatus ) {
            window._ = function(str, def) {
                if(str in AlFehrestNS.activeLanguage) {
                    return AlFehrestNS.activeLanguage[str];
                } else {
                    console.warn("Missing string " + str);
                    return def || str;
                }
            };
        })
        .fail(function( jqxhr, settings, exception ) {
            console.warn("Failed to load language");
            window._ = function(str, def) {
                return def || str;
            };
        });

};
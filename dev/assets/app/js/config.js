AlFehrestNS.cfg = function(key) {

    var config = {
        'production' : {
            'url' : 'http://alfehrest.org/nodejs/'
        },
        'development' :{
            'url' : 'http://localhost:8080/api/'
        }
    };

    var cfg = config[AlFehrestNS.env];
    if(typeof cfg[key] === 'undefined') {
        throw("Couldn't find configuration key " + key);
    }
    return cfg[key]
    
};
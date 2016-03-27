AlFehrestNS.cfg = function(key) {

    var config = {
        'production' : {
            'url' : 'http://alfehrest.org/nodejs/',
            'prophetId' : 'person_NJ0egMK1a86e'
        },
        'development' :{
            'url' : 'http://localhost:8080/api/',
            'prophetId' : 'person_N1vLYXWCe'
        }
    };

    var cfg = config[AlFehrestNS.env];
    if(typeof cfg[key] === 'undefined') {
        throw("Couldn't find configuration key " + key);
    }
    return cfg[key]
    
};
AlFehrestNS.cfg = function(key) {

    var config = {
        'production' : {
            'url' : 'http://api.alfehrest.org/seera',
            'prophetId' : 'person_241d581b957d9'
        },
        'development' :{
            'url' : 'http://localhost:5000/api/',
            'prophetId' : 'person_241d581b957d9'
        }
    };

    var cfg = config[AlFehrestNS.env];
    if(typeof cfg[key] === 'undefined') {
        throw("Couldn't find configuration key " + key);
    }
    return cfg[key]
    
};
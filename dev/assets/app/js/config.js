AlFehrestNS.cfg = function(key) {

    var config = {
        'url' : 'http://localhost:8080/api/'
    };

    if(typeof config[key] === 'undefined') {
        throw("Couldn't find configuration key " + key);
    }
    return config[key]
    
};
function getEntityData(id) {
    
    var parts = id.split('_');
    var url = AlFehrestNS.cfg('url') + parts[0] + "/" + id + "/related/";
    return $.ajax({
        url : url,
        headers: { "Content-language": "ar" }
    });
    
}
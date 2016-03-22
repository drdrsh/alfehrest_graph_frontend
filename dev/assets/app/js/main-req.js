function getEntityData(id) {
    
    var parts = id.split('_');
    var url = "http://localhost:8080/api/" + parts[0] + "/" + id + "/related";
    return $.ajax({
        url : url,
        headers: { "Content-language": "ar" }
    });
    
}
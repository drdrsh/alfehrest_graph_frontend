var graph = null;

function loadEntity(id) {
    getEntityData(id).then(function(data){
        renderNewItems(null, data);
    });
}
document.addEventListener('DOMContentLoaded', function(){
    graph = Viva.Graph.graph();
    startup();
    loadEntity('tribe_4yxlMYJaLpg');
});


function findNode(id) {
    var n = nodes[flatIndex[id]];
    if(!n) {
        throw("Node not found!");
    }
    return n;
}

function addLinks(data) {



    for(var idx in data.relationships) {
        for (var i = 0; i < data.relationships[idx].length; i++) {
            var rel = data.relationships[idx][i];
            graph.addLink(rel.firstEntityId, rel.secondEntityId);
        }
    }
}

function addNodes(data) {
    //TODO: Avoid duplication

    var mainEntity = data.entity;
    var mainEntityType = mainEntity._entity_type;
    var mainEntityId = mainEntity.id;
    mainEntity.loaded = true;
    mainEntity.nodeType = 'entity';

    graph.addNode(mainEntityId, mainEntity);


    for(var idx in data.relationships) {
        for(var i=0 ;i<data.relationships[idx].length; i++) {
            var e = data.relationships[idx][i].entity;
            var id= e.id;
            var type= e._entity_type;
            e.nodeType = 'entity';
            e.loaded = false;
            graph.addNode(id, e);
        }
    }

}

function renderNewItems(nodeId, data) {
    addNodes(data);
    addLinks(data);
    update();
}

function startup() {
    var layout = Viva.Graph.Layout.forceDirected(graph, {
        springLength : 30,
        springCoeff : 0.000008,
        dragCoeff : 0.01,
        gravity : -1.2,
        theta : 1
    });
    var graphics = Viva.Graph.View.webglGraphics();
    var renderer = Viva.Graph.View.renderer(graph, {
        layout     : layout,
        graphics   : graphics,
        renderLinks : true,
        prerender  : true
    });

    var events = Viva.Graph.webglInputEvents(graphics, graph);
    events.mouseEnter(function (node) {
        console.log('Mouse entered node: ' + node.id);
    }).mouseLeave(function (node) {
        console.log('Mouse left node: ' + node.id);
    }).dblClick(function (node) {
        console.log('Double click on node: ' + node.id);
    }).click(function (node) {
        loadEntity(node.id);
        //console.log('Single click on node: ' + node.id);
    });

    renderer.run();
}

function update() {

}
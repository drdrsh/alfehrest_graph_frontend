var force = null;
var svg = null;
var nodes = [];
var links = [];
var flatIndex = {};
var nodeIndex = {};
var linkIndex = {};
var lineIndex = {};
var isOverPrimative = false;

function loadEntity(id) {
    getEntityData(id).then(function(data){
        renderNewItems(null, data);
    });
}
document.addEventListener('DOMContentLoaded', function(){
    prepareLayout();
    getEntityData('tribe_4yxlMYJaLpg').then(function(data){
        renderNewItems(null, data);
    });
});

function onDoubleTap(event) {
    var d = event.cyTarget._private.data;
    if(d.loaded) {
        return;
    }
    getEntityData(d.id).then(function(data){
        renderNewItems(d.id, data)
    });
}

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
            var relType = [rel.firstEntityType, rel.secondEntityType].sort().join('_');

            if(!linkIndex[relType]) {
                linkIndex[relType] = {};
            }

            if( linkIndex[relType][rel.id] ) {
                continue;
            }

            rel.source = findNode(rel.firstEntityId);
            rel.target = findNode(rel.secondEntityId);
            rel.nodeType = 'rel';
            rel.text = rel.type;

            nodes.push(rel);
            linkIndex[relType][rel.id] = nodes.length - 1;
            flatIndex[rel.id] = nodes.length - 1;
            //links.push({"source": rel, "target": rel.targetNode});

        }
    }

    for(var i=0; i<nodes.length; i++) {
        var node = nodes[i];
        if(node.nodeType === 'rel') {
            node.source = findNode(node.firstEntityId);
            node.target = findNode(node.secondEntityId);
            var relType = [node.firstEntityType, node.secondEntityType].sort().join('_');

            if(!lineIndex[relType]) {
                lineIndex[relType] = {};
            }

            if( lineIndex[relType][node.id] ) {
                continue;
            }
            if(!lineIndex[relType][node.id]) {
                node.line = {"source": node.source, "target": node.target};
                links.push(node.line);
                lineIndex[relType][node.id] = links.length - 1;
            }

        }
        nodes[i] = node;
    }


}

function addNodes(data) {
    //TODO: Avoid duplication

    var mainEntity = data.entity;
    var mainEntityType = mainEntity._entity_type;
    var mainEntityId = mainEntity.id;
    mainEntity.loaded = true;
    mainEntity.nodeType = 'entity';

    if(!nodeIndex[mainEntityType]){
        nodeIndex[mainEntityType] = {};
    }

    if(!nodeIndex[mainEntityType][mainEntityId]) {
        nodes.push(mainEntity);
        nodeIndex[mainEntityType][mainEntityId] = nodes.length - 1;
        flatIndex[mainEntityId] = nodes.length - 1;
    }

    for(var idx in data.relationships) {
        for(var i=0 ;i<data.relationships[idx].length; i++) {
            var e = data.relationships[idx][i].entity;
            var id= e.id;
            var type= e._entity_type;
            e.nodeType = 'entity';
            e.loaded = false;
            if(!nodeIndex[type]){
                nodeIndex[type] = {};
            }
            if(!nodeIndex[type][id]) {
                nodes.push(e);
                nodeIndex[type][id] = nodes.length - 1;
                flatIndex[id] = nodes.length - 1;
            }
        }
    }

}

function renderNewItems(nodeId, data) {
    addNodes(data);
    addLinks(data);
    update();
}

function update() {

    force
        .nodes(nodes)
        .links(links)
        .start();

    var rendererLibrary = AlFehrestNS.Renderers;

    var l = nodes.length;
    var i = 0;
    var n = [];

    var orphanNodes = [];
    var orphanLines = [];
    for(var relType in linkIndex) {
        var rendererName = relType.substr(0, 1).toUpperCase() + relType.substr(1);
        var renderer = rendererLibrary.Relations[relType] || null;
        var n = [];
        var l = [];
        for(var idx1 in linkIndex[relType]) {
            var address = linkIndex[relType][idx1];
            n.push(nodes[address]);
        }
        for(var idx2 in lineIndex[relType]) {
            var address = lineIndex[relType][idx2];
            l.push(links[address]);
        }
        if(!renderer) {
            orphanNodes = orphanNodes.concat(n);
            orphanLines = orphanLines.concat(l);
        } else {
            renderer.update(svg, force, n, l);
        }
    }
    rendererLibrary.Relations.Basic.update(svg, force, orphanNodes, orphanLines);

    orphanNodes = [];
    for(var entityType in nodeIndex) {
        var rendererName = entityType.substr(0, 1).toUpperCase() + entityType.substr(1);
        var renderer = rendererLibrary.Entities[rendererName] || null;
        var n = [];
        for(var idx in nodeIndex[entityType]) {
            var address = nodeIndex[entityType][idx];
            n.push(nodes[address]);
        }
        if(!renderer) {
            orphanNodes = orphanNodes.concat(n);
        } else {
            renderer.update(svg, force, n);
        }
    }
    rendererLibrary.Entities.Basic.update(svg, force, orphanNodes);

    svg.selectAll('.node.entity')
    .on('click', function(d) {
        if(!d.loaded) {
            loadEntity(d.id);
        }
    });

}
var profiled = false;
function tick()  {
    var rendererLibrary = AlFehrestNS.Renderers;
    /*
    for(var entityType in nodeIndex) {
        var rendererName = entityType.substr(0, 1).toUpperCase() + entityType.substr(1);
        var renderer = rendererLibrary.Entities[rendererName] || rendererLibrary.Entities.Basic;
        renderer.tick(svg, force);
    }

    for(var relType in linkIndex) {
        var rendererName = entityType.substr(0, 1).toUpperCase() + entityType.substr(1);
        var renderer = rendererLibrary.Relations[relType] || rendererLibrary.Relations.Basic;
        renderer.tick(svg, force);
    }
    */
    if(!profiled) {
        console.profile();
    }

    rendererLibrary.Entities.Basic.tick(svg, force);
    rendererLibrary.Relations.Basic.tick(svg, force);

    if(!profiled) {
        console.profileEnd();
        profiled = true;
    }

}

function rescale() {
    var transform = " scale(" + d3.event.scale + ")";
    transform += " translate(" + d3.event.translate + ")";
    svg.selectAll('*').attr("transform", transform);
    update();
}

function prepareLayout() {

    var width = $(window).width();
    var height = $(window).height();

    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", rescale));

    //entityNodes = svg.selectAll(".entity-node");
    //linkNodes   = svg.selectAll(".link-node");
    //linkLines   = svg.selectAll('.link-line');

    force = d3.layout.force()
        .nodes([])
        .links([])
        .charge(-900)
        .linkDistance(function(d){
            if(d.loaded) {
                return 200;
            }  else {
                return 500;
            }
        })
        .size([width, height])
        .on('tick', tick)
        .start();

}

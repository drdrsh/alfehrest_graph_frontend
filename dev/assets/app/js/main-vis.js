var graph = null;
var nodes = null;
var edges = null;

function loadDetails(id) {

    var $dlg = $("#details-dialog");
    var $p   = $dlg.find("p").addClass("loading");
    var $ol  = $dlg.find("ol").html('');

    $dlg.find("h2").addClass("loading");
    $dlg.dialog( "option", "title", nodes.get(id).name )
        .dialog( "open" );
    getEntityDetails(id).then(function(data) {
        $dlg.find("h2").removeClass("loading");
        $p.removeClass("loading").html(
            (data.entity.description || data.entity.bio).replace(/\n/ig, "<br>")
        );
        for(var i=0; i<data.entity.references.length; i++) {
            $ol.append("<li />").html(data.entity.references[i]);
        }
        $p.parent().scrollTop(0);
    });

}

function loadEntity(id) {
    getEntityData(id).then(function(data){
        renderNewItems(id, data);
    });
}

function onSearchItemSelected(item) {
    $('.search input').val('');
    if(nodes.get(item.id)) {
        graph.selectNodes([item.id]);
        graph.focus(item.id, {
            scale: 1.4,
            animation: {duration: 250, easingFunction: "easeInOutQuart"}
        });
        return;
    }
    clearNetwork();
    loadEntity(item.id);
}

function clearNetwork() {
    nodes.clear();
    edges.clear();
}

document.addEventListener('DOMContentLoaded', function(){
    startup();
    getEntityList().then(function(a, b){
        var records = [];
        var data = [];
        records = records.concat(a[0]);
        records = records.concat(b[0]);
        for(var i=0; i<records.length; i++) {
            data.push({
                'id'    : records[i].id,
                'label' : records[i].name,
                'value' : records[i].name,
                'type'  : records[i].entity_type,
                'cb'    : onSearchItemSelected
            });
        }
        $('.search input').blur(function(){
            $(this).val("");
        });
        AlFehrestNS.SearchManager.attach($('.search input'));
        AlFehrestNS.SearchManager.register(data);
        
    });
    loadEntity('tribe_4JkxGYypI6l');
    loadEntity('person_NJ0egMK1a86e');


});


function neighbourhoodHighlight(id) {
    // if something is selected:

    var params = {'nodes': [id]};
    allNodes = nodes._data;
    if (params.nodes.length > 0) {
        highlightActive = true;
        var i,j;
        var selectedNode = params.nodes[0];
        var degrees = 1;

        // mark all nodes as hard to read.
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = 'rgba(200,200,200,0.1)';
            if (allNodes[nodeId].hiddenLabel === undefined) {
                allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
                allNodes[nodeId].label = undefined;
            }
        }
        var connectedNodes = graph.getConnectedNodes(selectedNode);
        var allConnectedNodes = [];

        // get the second degree nodes
        for (i = 1; i < degrees; i++) {
            for (j = 0; j < connectedNodes.length; j++) {
                allConnectedNodes = allConnectedNodes.concat(graph.getConnectedNodes(connectedNodes[j]));
            }
        }

        // all second degree nodes get a different color and their label back
        for (i = 0; i < allConnectedNodes.length; i++) {
            allNodes[allConnectedNodes[i]].color = 'rgba(150,150,150,0.75)';
            if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[allConnectedNodes[i]].label = allNodes[allConnectedNodes[i]].hiddenLabel;
                allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // all first degree nodes get their own color and their label back
        for (i = 0; i < connectedNodes.length; i++) {
            allNodes[connectedNodes[i]].color = undefined;
            if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
                allNodes[connectedNodes[i]].label = allNodes[connectedNodes[i]].hiddenLabel;
                allNodes[connectedNodes[i]].hiddenLabel = undefined;
            }
        }

        // the main node gets its own color and its label back.
        allNodes[selectedNode].color = undefined;
        if (allNodes[selectedNode].hiddenLabel !== undefined) {
            allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
            allNodes[selectedNode].hiddenLabel = undefined;
        }
    }
    else if (highlightActive === true) {
        // reset all nodes
        for (var nodeId in allNodes) {
            allNodes[nodeId].color = undefined;
            if (allNodes[nodeId].hiddenLabel !== undefined) {
                allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
                allNodes[nodeId].hiddenLabel = undefined;
            }
        }
        highlightActive = false
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
        if (allNodes.hasOwnProperty(nodeId)) {
            updateArray.push(allNodes[nodeId]);
        }
    }
    nodes.update(updateArray);
}

function addLinks(data) {

    for(var idx in data.relationships) {
        for (var i = 0; i < data.relationships[idx].length; i++) {
            var rel = data.relationships[idx][i];
            var fromNode = nodes.get(rel.firstEntityId);
            var toNode = nodes.get(rel.secondEntityId);
            var fromName = fromNode.name || fromNode.title;
            var toName = toNode.name || toNode.title;

            rel.from = rel.firstEntityId;
            rel.to = rel.secondEntityId;

            rel.label = _(rel.type);
            rel.arrows= 'to';
            rel.font = {align: 'middle'};
            rel.title = fromName + ' ← ' + rel.label + ' ← ' + toName;


            try {
                edges.add(rel);
            } catch(e) {
                //Do Nothing
            }
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

    mainEntity.group = mainEntity._entity_type;
    if(mainEntityId == 'person_NJ0egMK1a86e') {
        mainEntity.group = 'prophet';
    }
    mainEntity.label = mainEntity.name || mainEntity.title;
    mainEntity.title = mainEntity.name || mainEntity.title;

    try {
        nodes.add(mainEntity);
    } catch(e) {
        //Do nothing
    }

    for(var idx in data.relationships) {
        for(var i=0 ;i<data.relationships[idx].length; i++) {
            var e = data.relationships[idx][i].entity;
            var id= e.id;
            var type= e._entity_type;
            e.nodeType = 'entity';
            e.loaded = false;
            e.group = type;
            if(id == 'person_NJ0egMK1a86e') {
                e.group = 'prophet';
            }
            e.label = e.name || e.title;
            e.title = e.name || e.title;
            try {
                nodes.add(e);
            } catch(e) {
                //Do Nothing
            }
        }
    }

}

function renderNewItems(nodeId, data) {
    addNodes(data);
    addLinks(data);
    update();
    if(nodeId) {
        graph.focus(nodeId, {locked: true});
        graph.selectNodes([nodeId]);
    }
}

function image(name) {
    return AlFehrestNS.imagePath + name + '.png';
}

function startup() {

    $( "#details-dialog" ).dialog({
        autoOpen: false,
        height:500,
        width:500,
        modal: true,
        buttons: {
            "العودة": function() {
                $( this ).dialog( "close" );
            }
        }
    });


    var container = document.getElementById('graph-container');

    // create an array with nodes
    nodes = new vis.DataSet();
    edges = new vis.DataSet();

    var data = {
        nodes: nodes,
        edges: edges
    };
    AlFehrestNS.data = data;

    var options = {
        nodes: {
            scaling: {
                min: 16,
                max: 32
            },
            font: {
                size: 16,
                face: 'Droid Arabic Naskh',
                strokeWidth: 1
            }
        },
        edges: {
            color: {
                'color': '#aa0000',
                'hover': '#00aa00',
                'highlight': '#0000aa'
            },
            font: {
                size: 15,
                face: 'Droid Arabic Naskh'
            },
            smooth: true
        },
        interaction:{
            hover:true,
            navigationButtons: true
        },
        physics:{
            barnesHut:{gravitationalConstant:-30000},
            stabilization: {iterations:2500}
        },
        groups: {
            tribe: {
                shape: 'image',
                image: image('tribe')
            },
            person: {
                shape: 'image',
                image: image('person')
            },
            prophet: {
                shape: 'image',
                image: image('prophet')
            }
        }
    };
    AlFehrestNS.Graph = graph = new vis.Network(container, data, options);

    var dblClickTimeout = null;
    graph.on('stabilized', function(event){
        var hasSeenHelp = AlFehrestNS.LocalStorage.retrieve('SeenHelp');
        if(!hasSeenHelp){
            AlFehrestNS.LocalStorage.store("SeenHelp", true, -1);
            AlFehrestNS.HelpEngine.start();
        }
    });

    graph.on('doubleClick', function(event) {
        window.clearTimeout(dblClickTimeout);
        if(event.nodes.length) {
            loadEntity(event.nodes[0]);
        }
    });
    graph.on('hoverNode', function(event){
        document.body.style.cursor = "pointer";
        //neighbourhoodHighlight(event.node);
    });
    graph.on('blurNode', function(event){
        document.body.style.cursor = "default";
        //neighbourhoodHighlight();
    });
    graph.on('hoverEdge', function(event){
        document.body.style.cursor = "pointer";
        //neighbourhoodHighlight(event.node);
    });
    graph.on('blurEdge', function(event){
        document.body.style.cursor = "default";
        //neighbourhoodHighlight();
    });
    graph.on('click', function(event) {
        if(event.nodes.length) {
            window.clearTimeout(dblClickTimeout);
            dblClickTimeout = setTimeout(function(){
                loadDetails(event.nodes[0]);
            }, 250);
        }
    });
}

function update() {

}
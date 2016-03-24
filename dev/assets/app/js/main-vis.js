var graph = null;
var nodes = null;
var edges = null;

function loadDetails(id) {

    $( "#details-dialog p" ).addClass("loading");
    $( "#details-dialog" )
        .dialog( "option", "title", nodes.get(id).name )
        .dialog( "open" );
    getEntityDetails(id).then(function(data) {
        $( "#details-dialog p").removeClass("loading").html(
            data.entity.description || data.entity.bio
        );
    });

}

function loadEntity(id) {
    getEntityData(id).then(function(data){
        renderNewItems(null, data);
    });
}

document.addEventListener('DOMContentLoaded', function(){
    startup();
    loadEntity('tribe_4JkxGYypI6l');
    loadEntity('person_NJ0egMK1a86e');


});

function translate(str) {
    var lookup = {
        'tribe.sareeh': 'تابع صريح',
        'tribe.root' : 'أصل'
    };

    if(!lookup[str]) {
        return str;
    }
    return lookup[str];
}

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
            rel.from = rel.firstEntityId;
            rel.to = rel.secondEntityId;
            rel.label = translate(rel.type);
            rel.arrows= 'to';
            rel.font = {align: 'middle'};

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
}
function image(name) {
    return './assets/app/images/' + name + '.png';
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
    var options = {
        nodes: {
            scaling: {
                min: 16,
                max: 32
            }
        },
        edges: {
            color: {
                'color': '#aa0000',
                'hover': '#00aa00',
                'highlight': '#0000aa'
            },
            smooth: true
        },
        interaction:{hover:true},
        physics:{
            barnesHut:{gravitationalConstant:-30000},
            stabilization: {iterations:2500}
        },
        groups: {
            'switch': {
                shape: 'triangle',
                color: '#FF9900' // orange
            },
            desktop: {
                shape: 'dot',
                color: "#2B7CE9" // blue
            },
            mobile: {
                shape: 'dot',
                color: "#5A1E5C" // purple
            },
            server: {
                shape: 'square',
                color: "#C5000B" // red
            },
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
    graph = new vis.Network(container, data, options);

    var dblClickTimeout = null;
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
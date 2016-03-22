var cy = null;
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

function renderNewItems(nodeId, data) {

    var elements = [];

    if(!nodeId) {
        elements.push({
            data: {
                id: data.entity.id,
                label: data.entity.name,
                loaded: true
            },
            classes: 'center-center'
        });
    } else {
        var elm = cy.getElementById(nodeId);
        if(elm) {
            elm._private.data.loaded = true;
            console.log('loaded!');
        }
    }


    for (var idx in data.relationships) {
        for (var i = 0; i < data.relationships[idx].length; i++) {
            var rel = data.relationships[idx][i];
            elements.push({
                data: {
                    id: rel.entity.id,
                    label: rel.entity.name,
                    loaded: false
                },
                classes: 'center-center'
            });

            elements.push({
                data: {
                    source: rel.entity.id,
                    target: data.entity.id,
                    label: rel.type
                },
                classes: 'autorotate'
            });
        }
    }

    cy.add(elements);
    cy.layout({
        name: 'cola',
        animate: true, // whether to show the layout as it's running
        refresh: 1, // number of ticks per frame; higher is faster but more jerky
        maxSimulationTime: 4000, // max length in ms to run the layout
        ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
        fit: true, // on every layout reposition of nodes, fit the viewport
        padding: 30, // padding around the simulation
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }

        // layout event callbacks
        ready: function () {
        }, // on layoutready
        stop: function () {
        }, // on layoutstop

        // positioning options
        randomize: false, // use random node positions at beginning of layout
        avoidOverlap: true, // if true, prevents overlap of node bounding boxes
        handleDisconnected: true, // if true, avoids disconnected components from overlapping
        nodeSpacing: function (node) {
            return 10;
        }, // extra spacing around nodes
        flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
        alignment: undefined, // relative alignment constraints on nodes, e.g. function( node ){ return { x: 0, y: 1 } }

        // different methods of specifying edge length
        // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
        edgeLength: undefined, // sets edge length directly in simulation
        edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
        edgeJaccardLength: undefined, // jaccard edge length in simulation

        // iterations of cola algorithm; uses default values on undefined
        unconstrIter: undefined, // unconstrained initial layout iterations
        userConstIter: undefined, // initial layout iterations with user-specified constraints
        allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

        // infinite layout options
        infinite: false // overrides all other options for a forces-all-the-time mode
    });
}

function prepareLayout() {
    cy = window.cy = cytoscape({
        container: document.getElementById('cy'),

        boxSelectionEnabled: false,
        autounselectify: true,

        layout: {
            name: 'grid',
            cols: 3
        },

        style: [
            {
                selector: 'node',
                style: {
                    'height': 40,
                    'width': 40,
                    'background-color': '#ccc',
                    'label': 'data(label)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'label': 'data(label)',
                    'width': 3,
                    'line-color': '#ccc'
                }
            },

            {
                selector: '.top-left',
                style: {
                    'text-valign': 'top',
                    'text-halign': 'left'
                }
            },

            {
                selector: '.top-center',
                style: {
                    'text-valign': 'top',
                    'text-halign': 'center'
                }
            },

            {
                selector: '.top-right',
                style: {
                    'text-valign': 'top',
                    'text-halign': 'right'
                }
            },

            {
                selector: '.center-left',
                style: {
                    'text-valign': 'center',
                    'text-halign': 'left'
                }
            },

            {
                selector: '.center-center',
                style: {
                    'text-valign': 'center',
                    'text-halign': 'center'
                }
            },

            {
                selector: '.center-right',
                style: {
                    'text-valign': 'center',
                    'text-halign': 'right'
                }
            },

            {
                selector: '.bottom-left',
                style: {
                    'text-valign': 'bottom',
                    'text-halign': 'left'
                }
            },

            {
                selector: '.bottom-center',
                style: {
                    'text-valign': 'bottom',
                    'text-halign': 'center'
                }
            },

            {
                selector: '.bottom-right',
                style: {
                    'text-valign': 'bottom',
                    'text-halign': 'right'
                }
            },

            {
                selector: '.multiline-manual',
                style: {
                    'text-wrap': 'wrap'
                }
            },

            {
                selector: '.multiline-auto',
                style: {
                    'text-wrap': 'wrap',
                    'text-max-width': 80
                }
            },

            {
                selector: '.autorotate',
                style: {
                    'edge-text-rotation': 'autorotate'
                }
            },

            {
                selector: '.background',
                style: {
                    'text-background-opacity': 1,
                    'text-background-color': '#ccc',
                    'text-background-shape': 'roundrectangle',
                    'text-border-color': '#000',
                    'text-border-width': 1,
                    'text-border-opacity': 1
                }
            },

            {
                selector: '.outline',
                style: {
                    'text-outline-color': '#ccc',
                    'text-outline-width': 3
                }
            }
        ]
    });

    var cy = $('#cy').cytoscape('get');
    var tappedBefore;
    var tappedTimeout;
    cy.on('tap', function(event) {
        var tappedNow = event.cyTarget;
        if (tappedTimeout && tappedBefore) {
            clearTimeout(tappedTimeout);
        }
        if(tappedBefore === tappedNow) {
            tappedNow.trigger('doubleTap');
            tappedBefore = null;
        } else {
            tappedTimeout = setTimeout(function(){ tappedBefore = null; }, 300);
            tappedBefore = tappedNow;
        }
    });
    cy.on('doubleTap', 'node', onDoubleTap);
}
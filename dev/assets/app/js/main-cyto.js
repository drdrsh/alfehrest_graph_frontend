var cy = null;
document.addEventListener('DOMContentLoaded', function(){
    prepareLayout();
    getEntityData('tribe_4yxlMYJaLpg').then(renderNewItems);
});

function onDoubleTap(event) {
    var d = event.cyTarget._private.data;
    if(d.loaded) {
        return;
    }
    getEntityData(d.id).then(renderNewItems);
}

function renderNewItems(data) {
    console.log(data);
    var elements = [];
    elements.push({
       data: {
           id: data.entity.id,
           label: data.entity.name,
           loaded: true
       },
       classes: 'center-center'
    });

    for(var idx in data.relationships) {
        for(var i=0; i<data.relationships[idx].length; i++) {
            var rel = data.relationships[idx][i];
            elements.push({
                data: {
                    id : rel.entity.id,
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
    cy.layout({ name: 'concentric' });
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
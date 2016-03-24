/**
 * Created by Mostafa on 3/23/2016.
 */
AlFehrestNS.Renderers = AlFehrestNS.Renderers || {};
AlFehrestNS.Renderers.Entities = {};
AlFehrestNS.Renderers.Entities.Basic = (function() {
    
    var className = "basic";
    
    return {
        update: function(svg, force, nodes) {


            var eNodes = svg.selectAll(".node.entity." + className).data(nodes, function(d){ return d.id; });
            eNodes.exit().remove();
            eNodes.enter()
                .append("circle")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("class", "node entity " + className)
                .attr("r", 50)
                .style("fill", function(d) { return 'red'; })
                .call(force.drag);

            var textNodes = svg.selectAll("text.entity." + className).data(nodes, function(d){ return "text_" + d.id; });
            textNodes.exit().remove();
            textNodes.enter().append("text")
                .text( function (d) { return d.name || d.title })
                .attr("font-family", "sans-serif")
                .attr("class", "text entity " + className)
                .attr("font-size", "18px")
                .attr("fill", "white");

        },

        tick: function(svg, force) {
            svg.selectAll(".node.entity." + className)
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });


            svg.selectAll("text.entity." + className)
                .attr("x", function(d) {
                    var midline = d.x;
                    return midline - (this.getBBox().width / 2);
                })
                .attr("y", function(d) {
                    var midline = d.y;
                    return midline - (this.getBBox().height/ 2);
                })
        }
    }
})();

    

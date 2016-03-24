/**
 * Created by Mostafa on 3/23/2016.
 */
AlFehrestNS.Renderers = AlFehrestNS.Renderers || {};
AlFehrestNS.Renderers.Relations = {};
AlFehrestNS.Renderers.Relations.Basic = (function() {
    
    var className = "basic";

    function mag(v) {
        var l = v.length;
        var sum = 0;
        for(var i=0; i<l; i++) {
            sum += v[i] * v[i];
        }
        return Math.sqrt(sum);
    }

    function dot(v1, v2) {
        var l = v1.length;
        var sum = 0;
        for(var i=0; i<l; i++) {
            sum += v1[i] * v2[i];
        }
        return sum;
    }

    function angleWithXAxis(d) {

        var lineVector = [d.target.x - d.source.x,  d.target.y -  d.source.y] ;
        var xVector = [1, 0];
        var yVector = [0, 1];
        var cosine1 = dot(lineVector, xVector) / (mag(lineVector) * mag(xVector));
        var cosine2 = dot(lineVector, yVector) / (mag(lineVector) * mag(yVector));
        var deg1 = Math.acos(cosine1) * (180/Math.PI);
        var deg2 = Math.acos(cosine2) * (180/Math.PI);
        if(deg2 > 90) {
            deg1 -= 180;
        }
        return Math.abs(deg1);
    }

    return {
        update: function(svg, force, nodes, links) {


            var linkLines = svg.selectAll(".link." + className).data(links, function(d) { return d.source.id + "-" + d.target.id; });
            linkLines.exit().remove();
            linkLines.enter()
                .insert("line")
                .attr("class", "link " + className);

            var boxWidth = 50;
            var boxHeight= 50;
            var rNodes = svg.selectAll(".node.rel." + className).data(nodes, function(d){
                return d.id;
            });
            rNodes.exit().remove();
            rNodes.enter()
                .append("rect")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("width", function(d) { return 50; })
                .attr("height", function(d) { return 10; })
                .attr("class", "node rel " + className)
                .style("fill", function(d) { return 'green'; });

            var textNodes = svg.selectAll("text").data(nodes, function(d){ return "text_" + d.id; });
            textNodes.exit().remove();
            textNodes.enter().append("text")
                .text( function (d) { return d.text; })
                .attr("font-family", "sans-serif")
                .attr("class", "text rel " + className)
                .attr("font-size", "20px")
                .attr("fill", "red");


        },

        tick: function(svg, force) {

            svg.selectAll('.link.' + className)
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            svg.selectAll(".node.rel." + className)
                .attr("x", function(d) {
                    var midline = d.source.x + ((d.target.x - d.source.x) / 2);
                    return midline - (this.getBBox().width / 2);
                })
                .attr("y", function(d) {
                    var midline = d.source.y + ((d.target.y - d.source.y) / 2);
                    return midline - (this.getBBox().height/ 2);
                })
                .attr("transform", function(d){
                    var a = angleWithXAxis(d);
                    var x = parseFloat(d3.select(this).attr("x"));
                    var y = parseFloat(d3.select(this).attr("y"));
                    var hw= parseFloat((this.getBBox().width / 2));
                    var hh= parseFloat((this.getBBox().height/ 2));
                    var params = [a,  x + hw, y + hh];
                    return "rotate(" + params.join(',') + ")";
                });

            svg.selectAll("text.rel." + className)
                .attr("x", function(d) {
                    var midline = d.source.x + ((d.target.x - d.source.x) / 2);
                    return midline - (this.getBBox().width / 2);
                })
                .attr("y", function(d) {
                    var midline = d.source.y + ((d.target.y - d.source.y) / 2);
                    return midline - (this.getBBox().height/ 2);
                })
                .attr("transform", function(d){
                    var a = angleWithXAxis(d);
                    var x = parseFloat(d3.select(this).attr("x"));
                    var y = parseFloat(d3.select(this).attr("y"));
                    var hw= parseFloat((this.getBBox().width / 2));
                    var hh= parseFloat((this.getBBox().height/ 2));
                    var params = [a,  x + hw, y + hh];
                    return "rotate(" + params.join(',') + ")";
                });

        }
    }
})();

    

var treeData = {
    name: "HTML",
    children: [
        { 
            name: "HEAD",
            children: [
                { name: "TITLE", children: [{ name: "My Page Title" }] },
                { name: "LINK", children: [{ name: "style.css" }] }
            ]
        },
        { 
            name: "BODY",
            children: [
                { 
                    name: "DIV",
                    children: [
                        { name: "H1", children: [{ name: "Welcome to My Page" }] },
                        { name: "P", children: [{ name: "This is a paragraph." }] }
                    ]
                },
                { 
                    name: "SCRIPT",
                    children: [{ name: "script.js" },{ name: "fun.js" }]
                }
            ]
        }
    ]
};

function createAndShowTree(data, container) {
    var element = document.createElement('div');
    element.className = 'node';
    element.textContent = data.name;

    if (data.children) {
        var childrenContainer = document.createElement('div');
        data.children.forEach(function(child) {
            createAndShowTree(child, childrenContainer);
        });
        element.appendChild(childrenContainer);
    }

    container.appendChild(element);
}

// 获取容器元素并显示树
var container = document.getElementById('d3-container-div');
createAndShowTree(treeData, container);




// the d3js tree 

var root = d3.hierarchy(treeData)
  .sort((a,b) => b.height - a.height || a.data.name.localeCompare(b.data.name));

var treeLayout = d3.tree()
  .size([580, 80]);

treeLayout(root);

// Select the SVG element
var svg = d3.select("#demo1");

// Add links
svg.select('g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x;})
  .attr('y1', function(d) {return d.source.y;})
  .attr('x2', function(d) {return d.target.x;})
  .attr('y2', function(d) {return d.target.y;})
  .attr('stroke', "darkgray")
  .attr('stroke-width', 2);

// Add nodes
svg.select('g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 10)
  .attr("fill", "lightblue")
  .attr('stroke', "darkgray")
  .attr('stroke-width', 1);

  // draw labels
svg.select('g.labels')
  .selectAll('text.label')
  .data(root.descendants())
  .enter()
  .append('text')
  .classed('label', true)
  .style('fill', 'gray')
  .attr('x', function(d) {return d.x-5;})
  .attr('y', function(d) {return d.y+5;})
  .html((d) => d.data.name);

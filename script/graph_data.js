var node_data =[];
var edge_data = [];
var data = [];
var index_array = {};

chrome.storage.local.get('collections').then(items_o => {
chrome.storage.local.get('outputs').then(items => {
    
    raw_data = items.outputs;
    

    const seenNames = new Set();
    const temp_node_data = items_o.collections.reduce((accumulator, item) => {
        const parts = item.split(' ');
        const name = parts[1]; // 或者如果您想用整个 item 作为名称，则使用 item
    
        if (!seenNames.has(name)) {
            seenNames.add(name);
            accumulator.push({ name });
        }
    
        return accumulator;
    }, []);
    
    node_data = temp_node_data.map(item =>{
        return{
            name: item.name
        };
    });
    node_data.push({name : "HTML"});


    
    // node_data = items.outputs;

    
    // node_data = raw_data.map(item => {
    //     return {
    //         name: item.value.url
    //     };
    // });

    node_data.forEach((nod, index) => {
        console.log('print node',nod.name.name);
        index_array[nod.name] = index; // 或者使用任何你希望映射的数字
    });

   
    console.log('index_array', index_array);
    edge_data = items.outputs.map(item => {
        var temp_child = JSON.parse(item.value.child);
        
        if( !(item.value.url in index_array)){return [];}
        console.log('index_array[item.value.url]', index_array[item.value.url]);
        var local_url_index = index_array[item.value.url];
        
        if(temp_child.length !== 0 ){
            
                return temp_child.map(ps => {
                    console.log('lcoal_url_idnex', local_url_index);
                    
                    if( !(ps in index_array))return {
                        source: local_url_index,
                        target: 0
                    };
                    console.log('ohhhhhhhh',index_array[ps]);
                        return {
                            source: local_url_index,
                            target: index_array[ps]
                        }; 
                    });
            
        }else{
            return [];
        }
    }).flat();

    // 现在 data 已经准备好了，可以在这里处理或打印 data

    console.log('edge_data', edge_data);





//结点数据
var nodes=[ {name:"HTML"},
            {name:"BODY"},
            {name:"HEAD"},
              {name:"popup.css"},
              {name:"script.js"},
             {name:"style.css"},
             {name:"extension.css"},
             {name:"single"}
];
//边数据，id是nodes数组中的元素下标
var edges=[ {source:0,target:1},
            {source:0,target:2},
            {source:0,target:3},
            {source:0,target:4},
            {source:1,target:0},
            {source:1,target:2},
            {source:1,target:3},
            {source:1,target:4},
            {source:2,target:0},
];

nodes = node_data;
edges = edge_data;
var marge = {top:100,bottom:100,left:100,right:100}
var svg = d3.select("#demo1")    //获取画布
var width = svg.attr("width")  //画布的宽
var height = svg.attr("height")   //画布的高
var g = svg.append("g").attr("transform","translate("+marge.top+","+marge.left+")");



//设置一个color的颜色比例尺，为了让不同的顶点呈现不同的颜色
var colorScale = d3.scaleOrdinal()
    .domain(d3.range(nodes.length))
    .range(d3.schemeCategory10);
 
    // Custom color function based on node name
 function getNodeColor(nodeName) {
     if (nodeName.includes('.js')) {
         return 'blue'; // Blue color for .js files
     } else if (nodeName.includes('.css')) {
         return 'red'; // Red color for .css files
     
     }else if (nodeName.includes('.jpg' )) {
        return '#00FFFF'; // Red color for .css files
    }else if (nodeName.includes('.png' )) {
        return '#00FFFF'; // Red color for .css files
    }
     else if (nodeName.includes('HTML')) {
         return 'green'; // Red color for .css files
     } else {
         return 'black'; // Black color for other nodes
     }
 }

 // var colorScale = function(nodeName) {
 //     if (nodeName.includes('.js')) {
 //         return 'blue'; // Blue color for .js files
 //     } else if (nodeName.includes('.css')) {
 //         return 'red'; // Red color for .css files
 //     } else {
 //         return 'black'; // Black color for other nodes
 //     }
 // };
//新建一个力导向图，固定语句
var forceSimulation = d3.forceSimulation()
    .force("link",d3.forceLink()
    .distance(100)
    .strength(0.01)
    )
    .force("charge",d3.forceManyBody().strength(-20))
    .force("center",d3.forceCenter());
//初始化力导向图，也就是传入数据
//生成节点数据
forceSimulation.nodes(nodes).on("tick",ticked);//on()方法用于绑定时间监听器，tick事件是力导向布局每隔一段时间就会做的事

//生成边数据
forceSimulation.force("link")
    .links(edges)
    .distance(function(d)
    {   //每一边显示出来的长度
        return Math.ceil((Math.random()+2)*100);
    })

//设置图形的中心位置
forceSimulation.force("center").x(width/3).y(height/3);

//有了节点和边的数据后，我们开始绘制
//绘制边。要先绘制边，之后绘制顶点
var links = g.append("g")
    .selectAll("line")   //选择所有"line"元素
    .data(edges)   //将edges绑定上
    .enter()
    .append("line")
    .attr("stroke",function(d,i)
    {
        return "orange";  //这里决定了边的颜色
    })
    .attr("stroke-width",1);   //边的粗细

//为边添加文字
var linksText = g.append("g")
    .selectAll("text")
    .data(edges)
    .enter()
    .append("text")
    .text(function(d)
    {
        return "";  //这里返回的内容决定了每条边上显示的文字
    })

//绘制顶点
var gs = g.selectAll(".circleText")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform",function(d,i){
        var cirX = d.x;
        var cirY = d.y;
        return "translate("+cirX+","+cirY+")";
    })
    .call(d3.drag()  //drag是鼠标拖拽事件，start是鼠标左键按下时的事件。drag是拖住事件。ended是鼠标结束点击事件。
        .on("start",started)   //started，drag，end是自定义的三个函数
        .on("drag",dragged)
        .on("end",ended)
    );

//绘制节点
gs.append("circle")
    .attr("r",function(d){
     return d.name == "HTML" ? 15: 10; // if name is HTML, size is bigger
    })   //每个顶点的大小
    .attr("fill",function(d,i)
    {
        return getNodeColor(d.name);  //颜色
    })

//顶点上的文字
gs.append("text")
    .attr("x",-10)
    .attr("y",-20)
    .attr("dy",10)
    .text(function(d)
    {
        return d.name;
    })

//有向图的边是用带箭头的线来表示。如果是无向图，不需要这段代码
var marker=    svg.append("marker")
                .attr("id", "resolved")
                .attr("markerUnits","userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10")//坐标系的区域
                .attr("refX",30)//箭头在线上的位置，数值越小越靠近顶点
                .attr("refY", 0)
                .attr("markerWidth", 20)//箭头的大小（长度）
                .attr("markerHeight", 6)  //没用
                .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width",20)//箭头宽度
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                .attr('fill','#000000');//箭头颜色


function ticked()
{
    links
        .attr("x1",function(d){return d.source.x;})
        .attr("y1",function(d){return d.source.y;})
        .attr("x2",function(d){return d.target.x;})
        .attr("y2",function(d){return d.target.y;})
        .attr("marker-end", "url(#resolved)");

    linksText
        .attr("x",function(d)
        {
            return (d.source.x+d.target.x)/2;

        })
        .attr("y",function(d)
        {
            return (d.source.y+d.target.y)/2;
        });

    gs.attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function started(d)
{
    if(!d3.event.active)
    {
        forceSimulation.alphaTarget(0.1).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d)
{
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function ended(d)
{
 //    if(!d3.event.active)
 //    {
 //        forceSimulation.alphaTarget(0);
        
 //    }
 //    d.fx = null;
 //    d.fy = null;
}


});
});
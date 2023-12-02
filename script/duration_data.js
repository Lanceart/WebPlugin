// var data = [
//     { start: 0, end: 60, name: "任务 A" },     // 持续时间 60 秒
// { start: 170, end: 180, name: "任务 B1" },
//     { start: 70, end: 130, name: "任务 B" },  // 持续时间 60 秒
//     { start: 100, end: 200, name: "任务 C" }, // 持续时间 100 秒
//     { start: 150, end: 300, name: "任务 D" }, // 持续时间 150 秒
//     { start: 300, end: 600, name: "任务 E" }, // 持续时间 300 秒
// { start: 300, end: 1600, name: "任务 F" },
//  { start: 1000, end: 1600, name: "任务 G" }, { start: 1300, end: 2100, name: "任务 H" },
//     // 可以根据需要添加更多数据
// ];
var raw_data =[];
var data = [];

chrome.storage.local.get('outputs').then(items => {

    raw_data = items.outputs;

     raw_data = raw_data.slice(1).map(item => {
        return {
            start: item.value.start,
            end: item.value.end,
            name: item.value.url
        };
    });

    // 现在 data 已经准备好了，可以在这里处理或打印 data
    console.log(raw_data);

    data = raw_data.slice(1).map(item => {
        return {
            start: item.start, // 确保这里的属性名与您的原始数据匹配
            end: item.end,     // 确保这里的属性名与您的原始数据匹配
            name: item.name    // 确保这里的属性名与您的原始数据匹配
        };
    });

    var minStart = Math.min(...data.map(item => item.start));
    
    data = data.map(item => {
        return {
            ...item, // 保留原有的其他属性
            start: item.start - minStart, // 减去最小的 start 值
            end: item.end - minStart      // 同样减去最小的 start 值
        };
    });
    data.sort((a, b) => a.start - b.start);
    console.log('mother fucjer', data);


    data = [
        { start: 0, end: 60, name: "任务 A" },     // 持续时间 60 秒
    { start: 170, end: 180, name: "任务 B1" },
        { start: 70, end: 130, name: "任务 B" },  // 持续时间 60 秒
        { start: 100, end: 200, name: "任务 C" }, // 持续时间 100 秒
        { start: 150, end: 300, name: "任务 D" }, // 持续时间 150 秒
        { start: 300, end: 600, name: "任务 E" }, // 持续时间 300 秒
    { start: 300, end: 1600, name: "任务 F" },
     { start: 1000, end: 1600, name: "任务 G" }, { start: 1300, end: 2100, name: "任务 H" },
        // 可以根据需要添加更多数据
    ];

    var height = 500;

    // 创建比例尺
    

    var y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, height])
        .padding(0.1);

    // 创建颜色比例尺
    var color = d3.scaleLinear()
        .domain([0, 1000])
        //d3.max(data, d => d.end - d.start)
        .range(["#ccffcc", "red"]);

    // 创建 SVG 容器

    var totalWidth = d3.max(data, d => d.end); // 或者一个更大的值
    var svg = d3.select("svg").attr("width", totalWidth);
    var x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.end)])
    .range([0, totalWidth]);

    console.log(totalWidth);
    // var svg = d3.select("svg");

    // 绘制时间段
    svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => x(d.start))
        .attr("y", d => y(d.name))
        .attr("width", d => x(d.end) - x(d.start))
        .attr("height", y.bandwidth())
        .attr("fill", d => color(d.end - d.start));

    // 添加文本
    svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x", d => x(d.start) + (x(d.end) - x(d.start)) / 2)
        .attr("y", d => y(d.name) + y.bandwidth() / 2)
        .attr("dy", ".35em")
        .text(d => d.name);

    var xAxis = d3.axisBottom(x)
        .ticks(totalWidth/10) // 设置刻度数量
        .tickFormat(d3.format("d")); // 设置刻度格式

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);



    // 添加 Y 轴
    svg.append("g")
        .call(d3.axisLeft(y));
});


   
    
    
    
    


// 如果data是全局变量，可以直接调用
// 确保在data变量和d3.js加载后调用此函数





// SVG 容器尺寸

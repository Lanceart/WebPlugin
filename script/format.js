// 假设 localStorage 中已经有了相应的数据
// localStorage.setItem('data', JSON.stringify({ collections: ["LINK https://example.com/1", "LINK https://example.com/2"] }));

// 提取并解析数据
const p = chrome.storage.local.get('collections');
const r = chrome.storage.local.get('outputs');
r.then(data => {
    console.log('r', data.outputs[1].value);
    const table = document.createElement('table');
    const header = table.insertRow();
    const headers = ['Type', 'URL', 'Size', 'Duration(Bytes)']; // Add your column headers here

headers.forEach(headerText => {
    let headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    header.appendChild(headerCell);
});
    data.outputs.slice(1).forEach(item => {

        const row = table.insertRow();

        const type = row.insertCell();
        type.textContent = item.value.type;
        const url = row.insertCell();
        url.textContent = item.value.url;
        const size = row.insertCell();
        size.textContent = item.value.size;
        const duration = row.insertCell();
        duration.textContent = item.value.time;

    });
    document.getElementById('table-container').appendChild(table);
})
// p.then(data=>{
    
//     console.log("this",data.collections[1]);
//     const table = document.createElement('table');


//     // 为每个集合项创建一个表格行
//     data.collections.forEach(item => {
//         const parts = item.split(' ');
//         const row = table.insertRow();
//         parts.forEach(part => {
//             const cell = row.insertCell();
//             cell.textContent = part;
//         });
//     });
//     document.getElementById('table-container').appendChild(table);

// });


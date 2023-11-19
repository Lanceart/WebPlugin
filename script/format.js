// 假设 localStorage 中已经有了相应的数据
// localStorage.setItem('data', JSON.stringify({ collections: ["LINK https://example.com/1", "LINK https://example.com/2"] }));

// 提取并解析数据
const p = chrome.storage.local.get('collections');

p.then(data=>{
    
    console.log("this",data.collections[1]);
    const table = document.createElement('table');


    // 为每个集合项创建一个表格行
    data.collections.forEach(item => {
        const parts = item.split(' ');
        const row = table.insertRow();
        parts.forEach(part => {
            const cell = row.insertCell();
            cell.textContent = part;
        });
    });
    document.getElementById('table-container').appendChild(table);

});


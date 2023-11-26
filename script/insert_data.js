export function addData(db, storeName, data) {
    var request = db
      .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data);
  
    request.onsuccess = function (event) {
      console.log("数据写入成功");
    };
  
    request.onerror = function (event) {
      console.log("数据写入失败");
    };
};
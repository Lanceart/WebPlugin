document.addEventListener('DOMContentLoaded', function() {

    chrome.storage.local.get('collections', function(result) {
        if (result) {
            // 将数据转换为字符串并显示在页面上
            document.getElementById('linksContainer').textContent = JSON.stringify(result, null, 2);
        } else {
            document.getElementById('linksContainer').textContent = 'No links found.';
        }
    });
});
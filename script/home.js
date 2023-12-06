document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('buttonContent1').addEventListener('click', function() {
        openNewPage('table.html');
    });

    document.getElementById('buttonContent2').addEventListener('click', function() {
        openNewPage('dependencyGraph.html');
    });

    document.getElementById('buttonContent3').addEventListener('click', function() {
        openNewPage('durationpage.html');
    });
});

        function openNewPage(content) {
    // 根据传入的内容标识符打开新页面
    // 这里您可以根据实际情况修改 URL
        var url = 'chrome-extension://klemaddolapmbpffijbeflodbfknmnmi/' + content;
        window.open(url, '_blank');
    }
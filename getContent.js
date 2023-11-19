function collectLinks() {
    const links = Array.from(document.querySelectorAll('a') | document.querySelectorAll('script') | document.querySelectorAll('link') 
            | document.querySelectorAll('img') ).map(a => a.href);
            
    return links.filter(href => href );
}

function collectSrcs() {
    const selectors = 'a, script, link, img';
    const elements = document.querySelectorAll(selectors);

    const links = Array.from(elements).map(el => {
        // 对于 <a> 和 <link> 使用 href，对于 <script> 和 <img> 使用 src
        // return JSON.stringify(el.innerHTML);
        return el.tagName + " " + ( el.tagName === 'A' || el.tagName === 'LINK' ? el.href : el.src);
    });

    // 过滤掉空的或未定义的链接
    return links.filter(item => {
        const parts = item.split(" ");
        const url = parts[1];
        return url && (url.startsWith('http') || url.startsWith('https'));
    });
}

chrome.runtime.sendMessage({
    type: 'COLLECT_LINKS',
    url: window.location.href,
    links: collectSrcs()
});

chrome.runtime.sendMessage({download: "request", url: document.documentElement.outerHTML});

// document.querySelectorAll('img').forEach(img => {
    
//     chrome.downloads.download({url: img.src});
//   });
  
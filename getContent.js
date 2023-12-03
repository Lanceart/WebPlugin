(function() {

async function fetchScriptContent(url) {
    try {
        const response = await fetch(url);
        return response.ok ? await response.text() : null;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

function findScriptUrlsInContent(content) {
    const scriptUrlRegex = /import.*?from\s*["'](.+?)["']/g;
    let match;
    const urls = [];

    while ((match = scriptUrlRegex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    return urls;
}

async function fetchAndAnalyzeScripts(scriptUrls, depth = 0) {
    if (depth > 5) { // Limit the depth to avoid excessive recursion
        return;
    }

    for (const url of scriptUrls) {
        const content = await fetchScriptContent(url);
        if (content) {
            const childScriptUrls = findScriptUrlsInContent(content);
            chrome.runtime.sendMessage({
                type: 'FETCHING_LINKS',
                log: {url},
                child: childScriptUrls,
                size: new TextEncoder().encode(content).length
            });
            console.log(`Found URLs in ${url}:`, childScriptUrls);
            await fetchAndAnalyzeScripts(childScriptUrls, depth + 1);
        }
    }
}

// Start the process for scripts in the current document
console.log("begin to fetch the javascript");
const initialScriptUrls = Array.from(document.querySelectorAll('script[src]')).map(script => script.src);



// ///////begin CSS 

async function fetchCSSContent(url) {
    try {
        const response = await fetch(url);
        return response.ok ? await response.text() : null;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

function findCSSImportsInContent(content) {
    const cssImportRegex = /@import\s+["'](.+?)["']/g;
    let match;
    const urls = [];

    while ((match = cssImportRegex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    return urls;
}

async function fetchAndAnalyzeCSS(cssUrls, depth = 0) {
    if (depth > 5) { // 限制递归深度以避免过度递归
        return;
    }

    for (const url of cssUrls) {
        const content = await fetchCSSContent(url);
        if (content) {
            const childCSSUrls = findCSSImportsInContent(content);
            chrome.runtime.sendMessage({
                type: 'FETCHING_LINKS',
                log: {url},
                child: childCSSUrls,
                size: new TextEncoder().encode(content).length
            });
            console.log(`Found @import URLs in ${url}:`, childCSSUrls);
            await fetchAndAnalyzeCSS(childCSSUrls, depth + 1);
        }
    }
}

const initialCSSUrls = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);


const initialImageUrls = Array.from(document.querySelectorAll('img')).map(img => img.src);
console.log('I Got all the css', initialImageUrls);
// // img begin

var html_urls = [];
for (const url of initialScriptUrls) {
    html_urls.push(url);
}
for (const url of initialCSSUrls) {
    html_urls.push(url);
}
for (const url of initialImageUrls) {
    html_urls.push(url);
}

var url = 'HTML';
chrome.runtime.sendMessage({
    type: 'FETCHING_LINKS',
    log: { url},
    child: html_urls,
    size: 100
});


fetchAndAnalyzeScripts(initialScriptUrls);
fetchAndAnalyzeCSS(initialCSSUrls);



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

})();
// chrome.runtime.sendMessage({download: "request", url: document.documentElement.outerHTML});

// document.querySelectorAll('img').forEach(img => {
    
//     chrome.downloads.download({url: img.src});
//   });
  
const githubUserName = 'jyhyun1008' // 깃허브 아이디
const githubRepoName = 'iame' // 깃허브 레포지토리 이름

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject();
var page = qs.p;

if (!page) {
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/README.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_content").innerHTML += marked.parse(out)
    })
} else if (page == 'story') {
    var url = "https://raw.githubusercontent.com/"+githubUserName+"/"+githubRepoName+"/main/pages/story.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector(".page_content").innerHTML += marked.parse(out)
    })
}
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
} else if (page == 'blog') {
    document.querySelector(".page_title").innerText = '블로그'
    document.querySelector(".page_content").innerHTML += '<div class="article_list"></div>'
    var url = "https://api.github.com/repos/"+githubUserName+"/"+githubRepoName+"/git/trees/main"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        var resultree1 = JSON.parse(out).tree;
        for (var k=0; k < resultree1.length; k++) {
            if (resultree1[k].path == 'posts') {
                var resulturl1 = resultree1[k].url
                fetch(resulturl1)
                .then(res2 => res2.text())
                .then((out2) => {
                    var resultree2 = JSON.parse(out2).tree;
                    for (var i=0; i < resultree2.length; i++) {
                        if (resultree2[i].path == directory.split('/')[0]) {
                            var resulturl2 = resultree2[i].url
                            fetch(resulturl2)
                            .then(res3 => res3.text())
                            .then((out3) => {
                                var result = JSON.parse(out3).tree
                                result.sort((a, b) => parseInt(b.path.split('_')[1]) - parseInt(a.path.split('_')[1]));
                                var articles = []
                                var categories = []
                                for (var j=0; j<result.length;j++) {
                                    articles.push({
                                        title: result[j].path.split('_')[2].split('.')[0],
                                        category: result[j].path.split('_')[0],
                                        date: result[j].path.split('_')[1]
                                    })
                                    categories.push(result[j].path.split('_')[0])
                                }

                                var categorieset = new Set(categories);
                                categories = [...categorieset];
                                var category

                                if (directory.split('/').length == 1) {
                                    category = ''
                                } else {
                                    category = directory.split('/')[1]
                                }

                                for (var j=0; j<articles.length; j++){
                                    if (articles[j].category == category || category == ''){
                                        document.querySelector(".article_list").innerHTML += '<div class="article"><a href="./?p='+directory.split('/')[0]+'/'+articles[j].category+'_'+articles[j].date+'_'+articles[j].title+'"><span>'+articles[j].title+'</span><span><code>'+articles[j].category+'</code> <code>'+articles[j].date+'</code></span></a></div>'
                                    }
                                }

                                getCat(directory.split('/')[0], categories);
                            })
                        }
                    }
                })
            }
        }
    })
}
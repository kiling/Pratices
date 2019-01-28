/**
 * Created by msi on 2018/4/27.
 */

window.onload = function () {
    getSaying();
};

let btnRefresh = document.getElementById('refresh');
btnRefresh.addEventListener('click', function () {
    getSaying();
});

function getSaying() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://v1.hitokoto.cn');
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4) {
            document.querySelector('#saying').innerText = JSON.parse(xhr.responseText)['hitokoto'];
            document.querySelector('#author').innerText = '-- ' + JSON.parse(xhr.responseText)['from'];
            document.title = JSON.parse(xhr.responseText)['hitokoto'] + '-- ' + JSON.parse(xhr.responseText)['from'];
            let shareUrl = 'http://service.weibo.com/share/share.php?url=' + document.URL + '&type=button&language=zh_cn&appkey=3675162588&searchPic=false&style=simple&title=' + document.title;
            document.getElementById('share').setAttribute('href', shareUrl);
        }
    };
    xhr.send();
}

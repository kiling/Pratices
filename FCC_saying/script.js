/**
 * Created by msi on 2018/4/27.
 */

window.onload = function () {
    console.log('test');
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://v1.hitokoto.cn');
  xhr.onreadystatechange = function () {
      if(xhr.readyState == 4) {
          console.log(xhr.responseText);
          document.querySelector('#saying').innerText = JSON.parse(xhr.responseText)['hitokoto'];
          document.querySelector('#author').innerText = '-- ' + JSON.parse(xhr.responseText)['from'];
      }
  };
  xhr.send();
};

let btnRefresh = document.getElementById('refresh');
btnRefresh.addEventListener('click', function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://v1.hitokoto.cn/?c=a');
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4) {
            document.querySelector('#saying').innerText = JSON.parse(xhr.responseText)['hitokoto'];
            document.querySelector('#author').innerText = '-- ' + JSON.parse(xhr.responseText)['from'];
        }
    };
    xhr.send();
});

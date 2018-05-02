/**
 * Created by msi on 2018/4/22.
 */

let obj = {
    isHide: false, // 默认弹幕为不隐藏
    isClear: false
};

window.onload = function () {
  let btn = document.querySelector('#send');
  let ul = document.querySelector('ul');
  btn.addEventListener('click', function () {
      let text = document.querySelector('#danmu-text').value;
      if(text == '') {
          return;
      }
      ul.style.height = parseInt(ul.style.height) + 20 + 'px';
      ul.appendChild(createLineDanmu(text));
      document.querySelector('#danmu-text').value = '';
      // 点击发送按钮后把弹幕加到 danmu-container dom 中
      let danmuContainer = document.querySelector('#danmu-container');
      let temp = createDanmuBlock(text);
      danmuContainer.appendChild(temp);
      temp.classList.add('danmu-scroll');
      temp.style.transform = 'translateX(-' + (500 + temp.clientWidth) + 'px)';
      setTimeout(function () {
          removeDanmu(temp);
      }, 3000);
  });
  let text = document.querySelector('#danmu-text');
  text.addEventListener('keydown', function (e) { // 发送弹幕
      if(e.keyCode == 13) {
          console.log('enter clicked');
          btn.click();
      }
  });
  let btnClr = document.querySelector('#clear');
  btnClr.addEventListener('click', function () { // 清屏
      obj.isClear = true;
      let danmuContainer = document.querySelector('#danmu-container');
      danmuContainer.innerHTML = '';
      let ul = document.querySelector('ul');
      ul.innerHTML = '';
  });
  let btnHide = document.querySelector('#hide');
  btnHide.addEventListener('click', function () { // 隐藏弹幕
      toggleHide();
  })
};

function createLineDanmu(text) { // 右侧弹幕
    let li = document.createElement('li');
    li.classList.add('danmu-line');
    let txt = document.createTextNode(text);
    li.appendChild(txt);
    return li;
}

function createDanmuBlock(text) { // 视频处弹幕
    let div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.position = 'absolute';
    div.style.top = Math.floor(Math.random() * 15) * 20 + 'px'; // 弹幕墙高度为 300 取每行高度 20
    div.style.left = '500px';
    div.innerText = text;
    return div;
}

function toggleHide() {
    let danmuContainer = document.querySelector('#danmu-container');
    if(obj.isHide) { // 当前弹幕隐藏
        document.querySelector('#hide').innerText = '隐藏弹幕';
        danmuContainer.classList.remove('hide');
        obj.isHide = false;
    } else {
        document.querySelector('#hide').innerText = '显示弹幕';
        obj.isHide = true;
        danmuContainer.classList.add('hide');
    }
}

function removeDanmu(danmu) {
    let danmuContainer = document.querySelector('#danmu-container');
    if(danmuContainer.contains(danmu)) {
            danmuContainer.removeChild(danmu);
    } else {

    }

}
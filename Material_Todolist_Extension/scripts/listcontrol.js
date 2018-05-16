
window.onload = function () {
    let undoneUl = document.querySelector('#undone-ul');
    let doneUl = document.querySelector('#done-ul');
    undoneUl.addEventListener('click', function (e) {
        if(e.target.nodeName.toLowerCase() == 'img') { // 处理点击删除按钮操作
            // 写在数组删除及更新 localStorage
            let index = getIndex(e.target.parentNode);
            e.target.parentNode.classList.add('delete');
            undoneArr.splice(index, 1);
            localStorage.undoneArr = JSON.stringify(undoneArr);
            setTimeout(function () {
                undoneUl.removeChild(undoneUl.children[index]);
            }, 150);
        }
        if(e.target.nodeName.toLowerCase() == 'label') {
            console.log('label clicked');
            e.preventDefault();
        }
    });
    doneUl.addEventListener('click', function (e) {
        if(e.target.nodeName.toLowerCase() == 'img') { // 处理点击删除按钮操作
            // 写在数组删除及更新 localStorage
            console.log([].indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode));
            let index = [].indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
            doneArr.splice(index, 1);
            localStorage.doneArr = JSON.stringify(doneArr);
            doneUl.removeChild(e.target.parentNode);
        }
    });
    initRender(undoneArr);
    doneRender(doneArr);
};

localStorage.undoneArr = localStorage.undoneArr == undefined ? JSON.stringify([]) : localStorage.undoneArr;
localStorage.doneArr = localStorage.doneArr == undefined ? JSON.stringify([]) : localStorage.doneArr;
let undoneArr = JSON.parse(localStorage.undoneArr);
let doneArr = JSON.parse(localStorage.doneArr);
initRender(undoneArr);
doneRender(doneArr);

function createNewListItem(str) { // 构建列表项
    let li = document.createElement('li');
    li.classList.add('mdl-list__item');
    let label = document.createElement('label');
    label.classList.add('mdl-checkbox', 'mdl-js-checkbox', 'mdl-js-ripple-effect'/*, 'is-upgraded', 'mdl-js-ripple-effect--ignore-events'*/);
    label.setAttribute('contentEditable', 'true');

    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('mdl-checkbox__input');

    let textItem = document.createElement('input');
    textItem.setAttribute('type', 'text');
    textItem.classList.add('mdl-checkbox__label');
    textItem.value = str;
    //
    let img = document.createElement('img');
    img.classList.add('btn-del');
    img.setAttribute('src', 'images/delete.png');
    img.setAttribute('title', 'delete');
    label.appendChild(input);
    // label.appendChild(span);
    label.appendChild(textItem);
    label.addEventListener('change', function (e) { // label 的 change 事件同时响应子元素 checkbox 和 input[text]
        let index = [].indexOf.call(e.currentTarget.parentNode.parentNode.children, e.currentTarget.parentNode);
        switch (e.target.type)
        {
            case 'checkbox':
                if(e.target.checked) {
                    undoneArr.splice(index, 1);
                    localStorage.undoneArr = JSON.stringify(undoneArr);
                    markDone(e.target.parentNode.children[1].value);
                    let undone = document.querySelector('#undone-ul');
                    e.target.parentNode.parentNode.classList.remove('show');
                    setTimeout(function () {
                        undone.removeChild(undone.children[index]);
                    }, 850);
                }
                break;
            case 'text':
                if(e.target.value == '') {
                    undoneArr.splice(index, 1);
                    localStorage.undoneArr = JSON.stringify(undoneArr);
                    initRender(undoneArr);
                    return;
                }
                undoneArr[index] = e.target.value;
                localStorage.undoneArr = JSON.stringify(undoneArr);
                break;
            default:
                return;
        }

    });
    componentHandler.upgradeElement(label); // 先加入到 mdl 的 list 中，才能渲染到样式
    li.appendChild(label);
    li.appendChild(img);
    return li;
}

function createNewDoneListItem(str) {
    let li = document.createElement('li');
    li.classList.add('mdl-list__item');
    let label = document.createElement('label');
    label.classList.add('mdl-checkbox', 'mdl-js-checkbox', 'mdl-js-ripple-effect');
    //
    label.addEventListener('change', function (e) { // label 的 change 事件同时响应子元素 checkbox 和 input[text]
        let index = [].indexOf.call(e.currentTarget.parentNode.parentNode.children, e.currentTarget.parentNode);
        if(e.target.type == 'checkbox') {
            if(!e.target.checked) {
                console.log(e.target.parentNode.children[1].innerText);
                doneArr.splice(index, 1);
                localStorage.doneArr = JSON.stringify(doneArr);
                markUndone(e.target.parentNode.children[1].innerText);
                doneRender(doneArr);
            }
        }

    });
    //
    let input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.classList.add('mdl-checkbox__input');
    input.setAttribute('checked', true);
    let textItem = document.createElement('span');
    textItem.classList.add('done-item-text', 'done-item');
    textItem.innerText = str;
    textItem.addEventListener('click', function (e) { // 阻止 mdl.js 中绑定了 checkbox 的行为防止误点击
        e.preventDefault();
    });
    let img = document.createElement('img');
    img.classList.add('btn-del');
    img.setAttribute('src', 'images/delete.png');
    img.setAttribute('title', 'delete');
    label.appendChild(input);
    label.appendChild(textItem);
    // btn-del click event
    componentHandler.upgradeElement(label); // 先加入到 mdl 的 list 中，才能渲染到样式
    li.appendChild(label);
    li.appendChild(img);
    return li;
}

function initRender(arr) {
    if(arr.length == 0) {
        return;
    }
    let undoneUl = document.querySelector('#undone-ul');
    undoneUl.innerHTML = '';
    for(let i = 0; i < arr.length; i++) {
        let newListItem = createNewListItem(arr[i]);
        undoneUl.appendChild(newListItem);
        setTimeout(function () {
            newListItem.classList.add('show');
        }, 300);
    }
}

function doneRender(arr) { // 已完成列表 dom 渲染（可以跟 initRender() 合并
    let doneUl = document.querySelector('#done-ul');
    if(arr.length == 0) {
        doneUl.innerHTML = '';
        return;
    }
    doneUl.innerHTML = '';
    for(let i = 0; i < arr.length; i++) {
        let newListItem = createNewDoneListItem(arr[i]);
        doneUl.appendChild(newListItem);
    }
}

let addBtn = document.querySelector('#btn-add');
addBtn.addEventListener('click', function () {
    let undoneUl = document.querySelector('#undone-ul');
    let inputText = document.getElementById('input-text').value;
    if(inputText.length == 0) { // 输入的文本为空时返回
        return;
    }
    let li = createNewListItem(inputText.toString());
    componentHandler.upgradeElement(li);
    undoneUl.appendChild(li);
    setTimeout(function () {
        li.classList.add('show');
    }, 300);
    undoneArr.push(inputText);
    localStorage.undoneArr = JSON.stringify(undoneArr);
    document.getElementById('input-text').value = '';
});

let undoneUl = document.querySelector('#undone-ul');

function markDone(text) { // 未完成项目标记为已完成时重新构建 html
    //
    let done = document.querySelector('#done-ul');
    let newItem = createNewDoneListItem(text);
    console.log(text);
    doneArr.push(text);
    localStorage.doneArr = JSON.stringify(doneArr);
    done.appendChild(newItem);
}

function markUndone(text) { // 已完成项目标记为未完成时重新构建 html
    let undoneItem = createNewListItem(text);
    undoneItem.classList.add('show');
    undoneArr.push(text);
    localStorage.undoneArr = JSON.stringify(undoneArr);
    undoneUl.appendChild(undoneItem);
}

function getIndex(item) {
    return [].indexOf.call(item.parentNode.children, item);
}

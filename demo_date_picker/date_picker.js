let input = document.getElementById('date-picker');
let dayOfMon = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 数组记录每个月有多少天(2月份默认28天，之后判断是否闰年再变化)
    isTodayContained = false, // 记录当前是否包含今天，用于标亮今天
    globalYear, globalMonth; // 用于记录渲染以后的年/月，在选年/月以后获取另一个数据重新渲染
input.addEventListener('focusin', addToDom);

// 点击日历/input以外的区域，则关闭日历
document.body.addEventListener('click', function (e) {
    if(document.querySelector('#calendar') == null) { // 日历不存在则不继续
        return;
    }
    if(document.querySelector('#date-picker').contains(e.target)) { // 日历存在，且点击的是 input 框，则不继续
        return;
    }
    if(e.target.tagName.toLocaleLowerCase() == 'td') { // 简单判断，如果点击的是日历外的 td，需要重新修改判断条件
        return;
    }
    if(!document.querySelector('#calendar').contains(e.target)) { // 点击的不是日历内的范围，则关闭日历
        removeCalendar();
    }
});

// 添加日历到dom中
function addToDom(year, month) {
    if(document.getElementById('calendar') !== null) {
        return;
    }
    let today = new Date();
    let t = createCalendar(today.getFullYear(), today.getMonth()+1); // getMonth 第一个为 0
    document.body.appendChild(t);
    t.classList.add('bd');
    t.style.top = +input.offsetTop + 30 + 'px';
    t.style.left = +input.offsetLeft + 'px';
    t.style.background = '#fff';
}

// 从dom中移除日历
function removeCalendar() {
    document.body.removeChild(document.querySelector('#calendar'));
}

// 是否闰年
function isLeapYear(year) {
    return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
}

// 获取格式化的日期 yyyy-mm-dd
function getFormattedDate(year, month, date) {
    let arr = [year, month, date];
    let tmp = arr.map(function (val) {
        return val.toString().length == 1 ? '0' + val : '' + val;
    });
    return tmp.join('-');
}

// 直接选择今天
function selectToday() {

}

// 创建显示日历的div，如果有今天，则今天用颜色强调
function createCalendar(year, month) {
    if(isLeapYear(year)) { // 闰年判断，如果是，则置 2 月天数为 29
        dayOfMon[1] = 29;
    }
    let today = new Date();
    let wrap = document.createElement('div');
    wrap.id = 'calendar';
    let opDiv = document.createElement('div');
    opDiv.classList.add('op-div');
    let yrBtn = document.createElement('button');
    yrBtn.id = 'year';
    yrBtn.innerText = year + '年';
    // 点击年份，选择年份以后跳转至对应年月
    yrBtn.addEventListener('click', function () {
        createYearPicker(+year);
    });
    let monBtn = document.createElement('button');
    monBtn.id = 'month';
    monBtn.innerText = month + '月';
    monBtn.addEventListener('click', createMonthPicker);
    let prevBtn = document.createElement('button');
    prevBtn.innerText = '←';
    prevBtn.addEventListener('click', prev);
    let nextBtn = document.createElement('button');
    nextBtn.innerText = '→';
    nextBtn.addEventListener('click', next);
    opDiv.appendChild(prevBtn);
    opDiv.appendChild(yrBtn);
    opDiv.appendChild(monBtn);
    opDiv.appendChild(nextBtn);
    wrap.appendChild(opDiv);
    // 日历 table 部分构造
    let table = document.createElement('table');
    table.id = 'calendar-table';
    let thead = document.createElement('thead');
    let day = ['日', '一', '二', '三', '四', '五', '六'];
    for(let val of day) {
        let tmp = document.createElement('th');
        tmp.innerText = val;
        thead.appendChild(tmp);
    }
    table.appendChild(thead);
    // 日历 table tbody 主体构造
    let tbody = document.createElement('tbody');
    let tmp = new Date(year, month-1, 1), // 月份起点为0
        arr = Array(dayOfMon[month-1]).fill(0),
        firstDay = tmp.getDay();
    for(let index in arr) { // 填充对应的 date
        arr[index] = +index + 1;
    }
    let addToHead = Array(firstDay).fill(''); // 第一天前面的空天数
    addToHead.forEach(function (val) {
        arr.unshift(val);
    });
    let addToTail = Array(40 - arr.length).fill(''); // 预留足够的格子数防止放不下 6 行
    addToTail.forEach(function (val) {
        arr.push(val);
    });
    if(today.getFullYear() == year && today.getMonth() == month - 1) { // 判断今天是否存在
        isTodayContained = true;
    }
    for(let i = 0; i < arr.length; i++) {
        if(i % 7 == 0) {
            // 创建 tr
            tr = document.createElement('tr');
        }
        // 创建 td 加入到 tr 中
        let td = document.createElement('td');
        td.innerText = arr[i];
        if(isTodayContained && arr[i] == today.getDate()) { // 标记今日
            td.classList.add('today');
        }
        tr.append(td);
        if(i % 7 == 6) {
            tbody.appendChild(tr);
        }
    }
    if(tr.childElementCount != 7) { // 最后一行不足 7 格时手动加入到 table
        tbody.appendChild(tr);
    }
    tbody.addEventListener('click', function (evt) {
        if(evt.target.innerText.trim()) {
            // 拼接年月，回填 input，关闭日历
            let date = evt.target.innerText.trim();
            input.value = getFormattedDate(globalYear, globalMonth, date);
            removeCalendar();
        }
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    globalYear = year;
    globalMonth = month;
    if(isLeapYear(year)) { // 重置 2 月天数为 28
        dayOfMon[1] = 28;
    }
    return wrap;
}

// next 按钮操作，分为年翻页与日历翻页
function next() {
    if(document.getElementById('yr-picker')) {
        // 处理年翻页
        let centerYear = document.getElementById('yr-picker').querySelectorAll('td')[7].innerText.replace(/\D/g, ''); // 获取中间的年份
        // !!最小年份限制？有些有做限制，有些没有，此处暂不做限制
        renderYrPicker(+centerYear + 15);
        return;
    }
    if(document.getElementById('mn-picker')) { // 月选择界面存在时，点击左右无效
        return;
    }
    // 日历翻页处理
    if(globalMonth == 12) { // 跨年处理
        renderCalendar(+globalYear + 1, 1);
    } else {
        renderCalendar(+globalYear, +globalMonth + 1);
    }
}

// prev 按钮操作，分为年翻页与日历翻页
function prev() {
    if(document.getElementById('yr-picker')) {
        // 处理年翻页
        let centerYear = document.getElementById('yr-picker').querySelectorAll('td')[7].innerText.replace(/\D/g, ''); // 获取中间的年份
        // !! 限制最小为 1900 年
        renderYrPicker(+centerYear - 15);
        return;
    }
    if(document.getElementById('mn-picker')) { // 月选择界面存在时，点击左右无效
        return;
    }
    // 日历翻页处理
    if(globalMonth == 1) { // 跨年处理
        renderCalendar(globalYear - 1, 12);
    } else {
        renderCalendar(globalYear, globalMonth - 1);
    }
}

// 渲染日历，在重新选择年/月或者翻页时调用
function renderCalendar(year, month) {
    if(isLeapYear(year)) {
        dayOfMon[1] = 29;
    }
    let today = new Date();
    isTodayContained = today.getFullYear() == year && today.getMonth() == month - 1;
    document.querySelector('.today') !== null ? document.querySelector('.today').classList.remove('today') : 1;
    let date = new Date(+year, +month - 1, 1); // 第一天，用于算第一天的起始位置
    let blank = date.getDay(),
        count = 1;
    let tdArr = document.querySelectorAll('#calendar-table>tbody>tr>td'); // 获取日历 td 数组
    for(let i = 0; i < tdArr.length; i++) {
        if(i < blank || i >= dayOfMon[month - 1] + blank) { // blank 为月份第一天前面的空格子数
            tdArr[i].innerText = '';
        } else {
            tdArr[i].innerText = count++;
        }
    }
    if(isTodayContained) {
        tdArr[blank + today.getDate() - 1].classList.add('today');
    }
    document.getElementById('year').innerText = year + '年';
    document.getElementById('month').innerText = month + '月';
    dayOfMon[1] = 28;
    globalYear = year;
    globalMonth = month;
}

// 点击年 button 以后，创建年选择 div，定好位插入到日历中
function createYearPicker(year) {
    if(document.getElementById('mn-picker')) { // 月份 picker 存在则关闭，避免显示冲突
        document.getElementById('calendar').removeChild(document.getElementById('mn-picker'));
    }
    if(document.getElementById('yr-picker')) { // 年份 picker 已存在，则屏蔽点击，避免多个年 picker 存在
        renderCalendar(globalYear, globalMonth);
        return;
    }
    let yrTable = document.createElement('table');
    yrTable.id = 'yr-picker';
    yrTable.style.position = 'absolute';
    yrTable.style.height = document.getElementById('calendar-table').clientHeight + 'px';
    yrTable.style.top = +document.querySelector('.op-div').getBoundingClientRect().height.toFixed(1) + 'px';
    yrTable.style.backgroundColor = '#fff';
    let tr,
        td,
        yrStart = year - 7;
    for(let i = 0; i < 5; i++) { // 构造年选择 table
        tr = document.createElement('tr');
        for(let j = 0; j < 3; j++) {
            td = document.createElement('td');
            td.innerText = yrStart++ + '年'; // 填充年份
            tr.append(td);
        }
        yrTable.appendChild(tr);
    }
    yrTable.addEventListener('click', function (evt) {
       if(evt.target.tagName.toLowerCase() == 'td') { // 点击年 td，渲染日历，并关闭年选择界面
           renderCalendar(+evt.target.innerText.replace(/\D/g, ''), globalMonth);
           document.getElementById('calendar').removeChild(document.getElementById('yr-picker'));
       }
    });
    document.getElementById('calendar').appendChild(yrTable);
}

// 渲染年选择页面，在年 picker 存在时点击 prev/next 时调用
function renderYrPicker(centerYear) {
    let tdArr = document.getElementById('yr-picker').querySelectorAll('td'),
        start = centerYear - 7;
    for(let i = 0; i < tdArr.length; i++) {
        tdArr[i].innerText = start++ + '年';
    }
}

// 生成月选择界面并插入到 DOM 中
function createMonthPicker() {
    if(document.getElementById('yr-picker')) { // 如果年选择页面存在，则移除
        document.getElementById('calendar').removeChild(document.getElementById('yr-picker'));
    }
    if(document.getElementById('mn-picker')) { // 本来存在，则不继续
        return;
    }
    let mnTable = document.createElement('table');
    mnTable.id = 'mn-picker';
    mnTable.style.position = 'absolute';
    mnTable.style.height = document.getElementById('calendar-table').clientHeight + 'px';
    mnTable.style.top = +document.querySelector('.op-div').getBoundingClientRect().height.toFixed(1) + 'px';
    mnTable.style.backgroundColor = '#fff';
    let td, tr, mnStart = 1;
    for(let i = 0; i < 4; i++) { // 构造月选择 table
        tr = document.createElement('tr');
        for(let j = 0; j < 3; j++) {
            td = document.createElement('td');
            td.innerText = mnStart++ + '月';
            tr.append(td);
        }
        mnTable.appendChild(tr);
    }
    mnTable.addEventListener('click', function (evt) {
        if(evt.target.tagName.toLowerCase() == 'td') { // 点击月 td，渲染日历 table，并关闭月选择界面
            renderCalendar(globalYear, +evt.target.innerText.replace(/\D/g, ''));
            document.getElementById('calendar').removeChild(document.getElementById('mn-picker'));
        }
    });
    document.getElementById('calendar').appendChild(mnTable);
}

let num1 = [],
    num2 = [],
    op = '',
    result = $("#result");

$(".btn").click(function () {
   if($(this).hasClass('num')) { // 判断是否为数字输入
       if(!op.length) {
           if(!num1.length) { // 结果区清屏，开始显示第一个数输入
               render('');
           }
           if($(this).text() == '.') {
               if($.inArray('.', num1) == -1) { // 没有输入过小数点
                   num1.push($(this).text());
                   result.append($(this).text());
               } else {
                   return ;
               }
           } else {
               num1.push($(this).text());
               result.append($(this).text());
           }

       } else {
           if(!num2.length) { // 如果第二个数刚开始，则把结果区清屏，显示第二个数
               result.text('');
           }
           if($(this).text() == '.') {
               if($.inArray('.', num2) == -1) { // 没有输入过小数点
                   num2.push($(this).text());
                   result.append($(this).text());
               } else {
                   return ;
               }
           } else {
               num2.push($(this).text());
               result.append($(this).text());
           }
       }
   } else if($(this).hasClass('operator')) { // 判断是否为操作符
       if(!op.length) {
           if(!num1.length) { // 刚进行运算，继续按了操作符，把之前的结果作为 num1
               if(!checkNumber()) { // 结果不是数字的话阻止
                   return ;
               }
               num1 = $('#result').text().split('');
           }
           op = $(this).text();
       } else { // 输入第 1+ 个操作符，对前面的进行运算
           opexec();
           // 上面进行了重置，重新给 num1 和 op 赋值
           num1 = $('#result').text().split('');
           op = $(this).text();
       }
   } else if($(this).hasClass('backspace')){ // 退格处理
       if(!op.length) {
           bsop(num1);
       } else {
           bsop(num2);
       }
   } else if($(this).hasClass('percent')){ // 百分号处理
       if(!op.length) {
           num1 = pctop(num1);
       } else {
           num2 = pctop(num2);
       }
   } else if($(this).hasClass('clear')){ // clear 处理
       reset();
       render('');
   } else if($(this).hasClass('sqrt')){ // 根号处理
       if(!op.length) {
           num1 = sqrt(num1);
       } else {
           num2 = sqrt(num2);
       }
   } else if($(this).hasClass('square')){ // 平方处理
       if(!op.length) {
           num1 = square(num1);
       } else {
           num2 = square(num2);
       }
   } else if($(this).hasClass('ce')){ // ce 处理
       if(!op.length) {
           num1.length = 0;
           render('');
       } else {
           num2.length = 0;
           render('');
       }
   } else if($(this).hasClass('plus-minus')){ // +/- 处理
       if(!op.length) {
           num1 = pmop(num1);
       } else {
           num2 = pmop(num2);
       }
   } else if($(this).hasClass('reciprocal')){ // 1/x 处理
       if(!op.length) {
           num1 = reciprocal(num1);
       } else {
           num2 = reciprocal(num2);
       }
   } else if($(this).hasClass('eq')) { // 进行运算
       opexec();
   }
});

function opexec() { // 进行运算
    let n1 = Number(num1.join('')),
        n2 = Number(num2.join(''));
    switch (op) {
        case '+':
            result.text(floatop(n1 + n2));
            reset();
            break;
        case '-':
            result.text(floatop(n1 - n2));
            reset();
            break;
        case '×':
            result.text(floatop(n1 * n2));
            reset();
            break;
        case '÷':
            result.text(floatop(n1 / n2));
            reset();
            break;
        default:
            reset();
    }
}

function reset() {
    num1.length = 0;
    num2.length = 0;
    op = '';
}

function floatop(num) { // 对浮点数进行处理
    return parseFloat(num.toFixed(6));
}

function bsop(arr) { // 退格处理
    arr.pop();
    render(arr.join(''));
}

function pctop(arr) { // 百分号处理
    if(!arr.length) {
        return [];
    }
    let tmp = (parseFloat(arr.join('')) / 100).toString().split('');
    render(tmp.join(''));
    return tmp;
}

function sqrt(arr) { // 根号处理
    if(!arr.length) {
        return [];
    }
    let tmp = parseFloat(Math.sqrt(parseFloat(arr.join(''))).toFixed(6));
    render(tmp);
    if(!checkNumber()) {
        return [];
    }
    return tmp.toString().split('');
}

function square(arr) { // 平方处理
    if(!arr.length) {
        return [];
    }
    let tmp = parseFloat(Math.pow(parseFloat(arr.join('')), 2).toFixed(6));
    render(tmp);
    return tmp.toString().split('');
}

function reciprocal(arr) { // 1/x 处理
    if(!arr.length) {
        return [];
    }
    let tmp = parseFloat(Math.pow(parseFloat(arr.join('')), -1).toFixed(6));
    render(tmp);
    if(!checkNumber()) {
        return [];
    }
    return tmp.toString().split('');
}

function pmop(arr) { // +/- 处理
    let tmp = parseFloat(Number('-' + arr.join('')).toFixed(6));
    render(tmp);
    return tmp.toString().split('');
}

function render(content) {
    result.text(content);
}

function checkNumber() {
    let re = /^\-?\d*\.?\d*$/;
    return re.test(result.text());
}
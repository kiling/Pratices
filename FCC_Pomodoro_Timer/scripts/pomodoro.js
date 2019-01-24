let btnSession = $("#btn-session"),
    btnBreak = $('#btn-break');

let timer = { // 计时器对象
    state: '',
    session: 25,
    break: 5,
    loop: true,
    sessionId: '',
    breakId: '',
    isPaused: false,
    setSession: function () {
        let tmp = $('#session-text').val();
        if(timer.checkNum(tmp)) {
            this.session = Number(tmp);
        } else {
            timer.createToast('输入的应为1-60的整数数字');
        }
        timer.halt();
        this.render(this.session, this.break);
    },
    setBreak: function () {
        let tmp = $('#break-text').val();
        if(timer.checkNum(tmp)) {
            this.break = Number(tmp);
        } else {
            timer.createToast('输入的应为1-60的整数数字');
        }
        timer.halt();
        this.render(this.session, this.break);
    },
    startSession: function () {
        if(timer.sessionId) {
            clearInterval(timer.sessionId);
        }
		timer.reset();
		timer.createToast('working started');
        let min, sec, z;
        let leftSec = this.session * 60; // 剩余秒数
        let fullSec = leftSec; // 总秒数
        this.state = 'session';
        $('#state').text('session');
        $('#left-time').text(timer.createTimeText(leftSec));
		$('#time-counting').css('height', 0).addClass('session').removeClass('break');	
        this.sessionId = setInterval(function () { // 1s 执行一次
            if(leftSec == 0) {
                $('#left-time').text('');
                clearInterval(timer.sessionId);
                timer.startBreak();
                return ;
            }
            if(timer.isPaused) {
                return ;
            } else {
                leftSec--;
                $('#left-time').text(timer.createTimeText(leftSec));
                $('#time-counting').css('height', (fullSec - leftSec) / fullSec * 100 + '%');
            }

        }, 1000)
    },
    startBreak: function () {
        if(timer.breakId) {
            clearInterval(timer.breakId);
        }
		timer.reset();
		timer.createToast('breaking started');
        let min, sec, z;
        let leftSec = this.break * 60; // 剩余秒数
        let fullSec = leftSec;
        this.state = 'break';
        $('#state').text('break');
        $('#left-time').text(timer.createTimeText(leftSec));
		$('#time-counting').css('height', 0).removeClass('session').addClass('break');	
        this.breakId = setInterval(function () { // 1s 执行一次
            if(leftSec == 0) {
                $('#left-tim').text('');
                clearInterval(timer.breakId);
                timer.startSession();
                return ;
            }
            if(timer.isPaused) {
                return ;
            } else {
                leftSec--;
                $('#left-time').text(timer.createTimeText(leftSec));
                $('#time-counting').css('height', (fullSec - leftSec) / fullSec * 100 + '%');
            }

        }, 1000)
    },
    pause: function () {
        if(timer.sessionId || timer.breakId) {
            $('#btn-pause').text(timer.isPaused ? '暂停' : '恢复');
            timer.isPaused = !timer.isPaused;
        }
    },
    toggleState: function () { // 改变状态
        this.state = this.state == 'session' ? 'break' : 'session';
    },
    checkNum: function (text) { // 校验输入是否合法
        let re = /^[0-9]+$/;
        return $.isNumeric(text) && text < 60 && text > 1;
    },
    render: function (s, b) {
        $('#session').text(s);
        $('#break').text(b);
    },
    halt: function () {
        switch (timer.state) {
            case 'session':
                clearInterval(timer.sessionId);
                timer.reset();
                break;
            case 'break':
                clearInterval(timer.breakId);
                timer.reset();
                break;
        }
    },
    createTimeText: function (sec) {
        let m = parseInt(sec / 60),
            s = parseInt(sec % 60);
        return timer.paddingZero(m) + ':' + timer.paddingZero(s);
    },
    paddingZero: function (x) {
        return x < 10 ? '0' + x : x;
    },
    createToast: function (text) {
        let data = {message: text};
        let snackbarContainer = document.querySelector('#mdl-toast');
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    },
    reset: function () {
        timer.breakId = '';
        timer.sessionId = '';
        timer.isPaused = false;
        $('#btn-pause').text('暂停');
        $('#state').text('');
        $('#left-time').text('');
    }
};

timer.render(timer.session, timer.break);

btnSession.click(function () {
    timer.setSession();
});

btnBreak.click(function () {
    timer.setBreak();
});

$('#btn-start').click(function () {
   timer.startSession();
});

$('#btn-pause').click(function () {
    timer.pause();
});

$('#btn-halt').click(function () {
    timer.halt();
});

$('.clock-display').click(function () {
    timer.pause();
});


let game = {
    // property
    moves: [], // 正确的色块顺序，随 count 增大而增加一个值
    maxCount: 20, // 当 count == maxCount 时，游戏结束，通关成功
    count: 0, //
    isMouseDown: false,
    tmp: undefined, // 鼠标点下色块时, 保存当前点击的事件对象, 当按住状态下移出事件对象, 在事件对象区域外 mouseup 时, 取消原本色块的 bright
    clr: undefined, // 保存 display() 中的定时器 id, 用于取消
    isSwitchOn: false, // 开关状态
    strictMode: false,
    isWin: false, // 给 strict mode 用, 当为 strict mode 且通关时, 置该值为 true, 给 end() 判断
    currentMoves: [], // 玩家在当前的 count 下点击色块的顺序
    objSound: { // data-colorid 对应声音
        0: new Audio('audio/1do.mp3'),
        1: new Audio('audio/2re.mp3'),
        2: new Audio('audio/3mi.mp3'),
        3: new Audio('audio/4fa.mp3')
    },
    objColorId: { // data-colorid 对应id
        0: '#blue',
        1: '#red',
        2: '#yellow',
        3: '#green'
    },
    // function
    reset: function () {
        this.count = 0;
        this.moves = [];
        this.isWin = false;
        // this.screenDisplay('--');
    },
    init: function () {
        $("#btn-start").click(function () {
            if(game.isSwitchOn) {
                game.reset();
                game.nextCount();
                game.screenDisplay(game.count);
                setTimeout(function () {
                    game.display(game.moves);
                }, 1500);
            }
        });
        $("#switch-checkbox").change(function (evt) {
            if(game.isSwitchOn) {
                // 原本为打开的状态，则中断原来的所有操作
                game.screenDisplay('--');
                game.setPlayerColorEffectOff();
                clearInterval(game.clr);
            }
            let thumb = $("#switch-thumb");
            game.isSwitchOn = !game.isSwitchOn;
            thumb.toggleClass("on");
            thumb.toggleClass("off");
        });
        $("#btn-strict").on("click", function () {
            if(game.isSwitchOn) {
                $("#strict-status").toggleClass("strict-on");
                game.strictMode = !game.strictMode;
            }
        });
        audioPreload(game.objSound);
    },
    check: function (colorid) { // 点击了色块以后, 判断当前点击色块是否与保存的 moves 的对应 value 符合
        // let audio = new Audio();
        // audio.src = game.objSound[colorid];
        // audio.load();
        // audio.play();
        // console.log(colorid);
        // game.objSound[colorid].load();
        game.objSound[colorid].play();
        game.objSound[colorid].currentTime = 0; // 把当前播放时间归零, 如果下次还是一样的音频时才会播
        // 判断当前点击色块结果与 moves 对比
        if(this.currentMoves[this.currentMoves.length - 1] == this.moves[this.currentMoves.length - 1]) { // 当前色块与 moves 对应
            if(this.currentMoves.length == this.moves.length) { // 当前 count 结束，进入下一个 count
                if(this.currentMoves.length == game.maxCount) { // count == maxCount 游戏结束
                    this.end();
                    this.clearCurrentMoves();
                    this.setPlayerColorEffectOff();
                    this.screenDisplay('Win');
                    return 0;
                }
                this.clearCurrentMoves();
                this.nextCount();
                this.setPlayerColorEffectOff();
                this.screenDisplay(this.count);
                setTimeout(function () {
                    game.display(game.moves);
                }, 1500);
            }

        } else { // 不符合
            if(game.strictMode) { // strict mode 则直接输
                this.screenDisplay('lose');
                this.clearCurrentMoves();
                this.setPlayerColorEffectOff();
                setTimeout(function () {
                    game.end();
                }, 1000);
                // return 0;
            } else {
                console.log('game fail, currentCount again');
                this.screenDisplay('!!');
                this.clearCurrentMoves();
                this.setPlayerColorEffectOff();
                setTimeout(function () {
                    game.screenDisplay(game.count);
                }, 1000);
                setTimeout(function () {
                    game.display(game.moves);
                }, 1500);
            }

        }

    },
    resetCurrentCount: function () {
        this.clearCurrentMoves();
        this.setPlayerColorEffectOff();
        this.screenDisplay(this.count);
        this.display(this.moves);
    },
    clearCurrentMoves: function () {
        this.currentMoves = [];
    },
    nextCount: function () {
        this.count++;
        let num = Math.floor(Math.random() * 4);
        this.moves.push(num);
    },
    display: function (moves) {
        if(this.isSwitchOn) {
            this.unbindColor();
            $(".color").off("click", colorClickEvent);
            let i = 0, audio = new Audio();
            game.clr  = setInterval(function () {
                $(game.objColorId[moves[i]]).toggleClass('bright');
                // audio.src = game.objSound[moves[i]];
                // audio.load();
                // audio.play();
                // game.objSound[Number(moves[i])].load();
                game.objSound[Number(moves[i])].play();
                game.objSound[Number(moves[i])].currentTime = 0; // 把当前播放时间归零, 如果下次还是一样的音频时才会播
                (function(i){
                    setTimeout(function () {
                        $(game.objColorId[moves[i]]).toggleClass('bright');
                    }, 400);
                })(i);
                i++;
                if(i == moves.length) {
                    clearInterval(game.clr);
                }
            }, 800);
            setTimeout(function () { // 等整个 display 完了以后才允许 player 点击生效
                game.setPlayerColorEffectOn();
            }, (moves.length + 1) * 800);
        }
    },
    screenDisplay: function (text) { // 实现闪烁？
        let i = 0;
        if(Number(text) < 10) {
            text = '0' + text;
        }
        $("#display-screen-text").text(text);
        $('.display-screen-text').removeClass('switch-on');
        let aa = setInterval(function () {
            i++;
            if(i == 3) {
                clearInterval(aa);
            }
            $('.display-screen-text').toggleClass('switch-on');
        }, 400)
    },
    bindColor: function () { // 绑定 mouseup mousedown 事件
        $("body").on("mouseup", mouseupEvent);
        $(".color").on("mousedown", mousedownEvent);
    },
    unbindColor: function () {
        $("body").off("mouseup", mouseupEvent);
        $(".color").off("mousedown", mousedownEvent);
    },
    setPlayerColorEffectOn: function () { // 设置关于 player 点击色块的效果生效
        this.bindColor();
        $(".color").addClass("cursor-pointer").on("click", colorClickEvent);
    },
    setPlayerColorEffectOff: function () { // 设置关于 player 点击色块的效果不生效
        this.unbindColor();
        $(".color").removeClass("cursor-pointer").off("click", colorClickEvent);
    },
    end: function () {
        // 判断输赢, 如果是 strict mode 的话, 点错就进入 end, 非 strict mode 只有 完整通关才进入 end
        if(!this.strictMode) {
            this.reset();
            setTimeout(function () {
                alert("you win!");
            }, 1000);
        } else {
            // strict mode
            if(this.isWin) {
                // strict mode win
                this.reset();
                setTimeout(function () {
                    alert("you win!");
                }, 1000);
            } else {
                // strict mode lose
                this.reset();
                setTimeout(function () {
                    alert("you lose, click to restart the game.");
                }, 1000);
            }
        }
    }
};

game.init();

function colorClickEvent (evt) {
    game.currentMoves.push(evt.target.dataset.colorid);
    game.check(evt.target.dataset.colorid);
}

function mousedownEvent(evt) {
    $(evt.target).addClass("bright");
    game.isMouseDown = true;
    game.tmp = evt.target;
}

function mouseupEvent(evt) {
    if(game.isMouseDown == true) {
        $(game.tmp).removeClass("bright");
        game.isMouseDown = false;
    }
}

function audioPreload(arr) {
    for(let i = 0; i < arr.length; i++) {
        arr[i].load();
    }
}
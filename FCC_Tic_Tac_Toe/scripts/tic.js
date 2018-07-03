let game = {
    currentPlayer: '', // default 0, 1 -> player, -1 -> AI
    playerRole: '', // 玩家角色 O/X
    aiRole: '',
    isFirst: false, // 是否先手
    count: 0, // 一共走了几步
    result: '',
    allWinResult: [ // 所有能赢的可能
        [1, 2, 0],
        [4, 5, 3],
        [7, 8, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ],
    currentBoard: ['', '', '', '', '', '', '', '', ''], // 记录当前落子棋盘
    init: function () {
        this.playerRole = '';
        this.currentBoard = ['', '', '', '', '', '', '', '', ''];
        this.result = '';
        this.count = 0;
        $('#btn-choose-x').on('click', game.setRole);
        $('#btn-choose-o').on('click', game.setRole);
        $('.grid').each(function () {
            $(this).text('');
        }).on('click', game.clickGrid);
        $('#masking').css('display', 'flex');
        $('#restart').on('click', function () {
            game.init();
        });
        $('#masking-2').css('display', 'none');
    },
    clickGrid: function (e) {
        game.play(game.currentPlayer, game.playerRole, game.getPosition($(e.target)));
        game.aiPlay();
    },
    setRole: function () { // 设置玩家角色
        game.playerRole = $(this).text();
        game.aiRole = game.playerRole == 'X' ? 'O' : 'X';
        this.currentPlayer = this.playerRole; // cur -> player for test
        $('#masking').css('display', 'none');
    },
    play: function (player, role, pos) {
        // 判断当前玩家，当前角色，落子位置
        let tmp = $('[data-pos=' + pos + ']');
        if(!tmp.text()) { // 判断当前是否有落子
            tmp.text(role);
            this.count++;
            this.currentBoard[pos] = role;
            this.currentPlayer = this.aiRole;
        } else {
            return false;
        }
        if(!this.checkEnd()) {
        } else {
            this.end();
        }
    },
    aiPlay: function () { // AI 落子
        //
        if(this.checkEnd()) {
            return ;
        }
        if(this.currentPlayer == this.aiRole) {
            this.count++;
            let bestMove = this.getBestMove();
            this.currentBoard[bestMove] = this.aiRole;
            let str = '[data-pos=' + bestMove + ']';
            $(str).text(this.aiRole);
            this.currentPlayer = this.playerRole;
        }
        if(this.checkEnd()) {
            this.end();
        }
    },
    checkWin: function (board, role) {
        // 判断获胜
        for(let i = 0; i < this.allWinResult.length; i++) {
            if(isContain(this.getRoleResult(board, role), this.allWinResult[i])) { // board -> this.currentBoard
                return true;
            }
        }
        return false;
    },
    checkEnd: function () {
        if(this.checkWin(this.currentBoard, this.playerRole)) {
            this.result = 1;
            return true;
        }
        if(this.checkWin(this.currentBoard, this.aiRole)) {
            this.result = -1;
            return -1;
        }
        if(this.count == 9) {
            this.result = 0;
            return true;
        }
    },
    getRoleResult: function (board, role) {
        // 获取对应角色的已落子位置数组
        let tmpArr = [];
        for(let i = 0; i < board.length; i++) {
            if(board[i] == role) {
                tmpArr.push(i);
            }
        }
        return tmpArr;
    },
    getEmptySpot: function (board) { // 返回未落子的 grid 的 data-pos 数组
        let arr = [];
        for(let i = 0; i < board.length; i++) {
            if(board[i] == '') {
                arr.push(i);
            }
        }
        return arr;
    },
    end: function () { //
        $('.grid').off('click');
        let str;
        switch (this.result) {
            case 0:
                str = 'tie game.';
                break;
            case 1:
                str = 'You win!';
                break;
            case -1:
                str = 'You lose.';
                break;
        }
        $('#result-text').text(str);
        $('#masking-2').css('display', 'flex');
        $('.result-display').css('display', 'flex');
    },
    getPosition: function (ele) {
        return ele.data('pos');
    },
    getBestMove: function () {
        // 有赢的落子位置，则返回该位置
        if(this.getWinSpot(this.currentBoard) != -1) {
            return this.getWinSpot(this.currentBoard);
        }
        // 有输的落子位置，则返回该位置
        if(this.getLoseSpot(this.currentBoard) != -1) {
            return this.getLoseSpot(this.currentBoard);
        }
        // 都没有时，从剩余的位置中选出权重最高的，预设：中间>角>边中，另外有特殊情况，需要避免玩家占据对角两个
        if(this.currentBoard[4] == '') {
            return 4;
        } else if(this.getCorner(this.currentBoard) != -1) {
            return this.getCorner(this.currentBoard);
        } else if(this.getMiddle(this.currentBoard) != -1) {
            return this.getMiddle(this.currentBoard);
        }
    },
    getWinSpot: function (board) {
        // 能让 AI 赢的落子位置
        let emptySpots = this.getEmptySpot(board);
        for(let i = 0; i < emptySpots.length; i++) {
            let currentBrd = this.currentBoard;
            currentBrd[emptySpots[i]] = this.aiRole;
            if(this.checkWin(currentBrd, this.aiRole)) {
                currentBrd[emptySpots[i]] = '';
                return emptySpots[i];
            } else {
                currentBrd[emptySpots[i]] = '';
            }
        }
        return -1;
    },
    getLoseSpot: function (board) {
        // 能让 AI 输的位置
        let emptySpots = this.getEmptySpot(board);
        for(let i = 0; i < emptySpots.length; i++) {
            let currentBrd = this.currentBoard;
            currentBrd[emptySpots[i]] = this.playerRole;
            if(this.checkWin(currentBrd, this.playerRole)) {
                currentBrd[emptySpots[i]] = '';
                return emptySpots[i];
            } else {
                currentBrd[emptySpots[i]] = '';
            }
        }
        return -1;
    },
    getCorner: function (board) {
        // 防抢对角
        if(board[0] == this.playerRole && board[8] == '') {
            return 8;
        }
        if(board[2] == this.playerRole && board[6] == '') {
            return 6;
        }
        if(board[6] == this.playerRole && board[2] == '') {
            return 2;
        }
        if(board[8] == this.playerRole && board[0] == '') {
            return 0;
        }
        // 已经是对角
        if(board[0] == this.playerRole && board[8] == this.playerRole) {
            return 1;
        }
        if(board[2] == this.playerRole && board[6] == this.playerRole) {
            return 5;
        }
        // 占被玩家包围的角
        if(board[1] == this.playerRole && board[3] == this.playerRole && board[0] == '') {
            return 0;
        }
        if(board[1] == this.playerRole && board[5] == this.playerRole && board[2] == '') {
            return 2;
        }
        if(board[7] == this.playerRole && board[3] == this.playerRole && board[6] == '') {
            return 6;
        }
        if(board[7] == this.playerRole && board[5] == this.playerRole && board[8] == '') {
            return 8;
        }
        if(board[0] == '') {
            return 0;
        } else if(board[2] == '') {
            return 2;
        } else if(board[6] == '') {
            return 6;
        } else if(board[8] == '') {
            return 8;
        }
        return -1;
    },
    getMiddle: function (board) {
        if(board[1] == '') {
            return 1;
        } else if(board[3] == '') {
            return 3;
        } else if(board[5] == '') {
            return 5;
        } else if(board[7] == '') {
            return 7;
        }
        return -1;
    }
};

game.init();

// 判断一个数组是否包含另外一个一维数组(父数组可为一/二维)
function isContain(arr, subArr) {
    if(Array.isArray(arr[0])) {
        return arr.some(function(val){
            return arraysEqual(val, subArr);
        })
    } else {
        return arr.filter(function(val) {
                return subArr.indexOf(val) > -1;
            }).length == subArr.length;
    }
}

// 判断两个一维数组是否数值相等
function arraysEqual(a, b) {
    a.sort();
    b.sort();
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
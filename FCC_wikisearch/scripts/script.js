
$("#btn").click(function () {
    let keywords = $("#keywords").val();
    // console.log(keywords);
    if(!keywords.length) {
        console.log('empty');
        return false;
    }
    $("#result").empty();
    $.ajax({
        type: 'get',
        async: false,
        url: '//zh.wikipedia.org/w/api.php', // 中文 wiki 使用英文也能检索到对应的中文词条，如果使用英文 wiki，输入中文无法精确检索到
        data: {
            action: 'query',
            list: 'search',
            srsearch: keywords,
            format: 'json',
            formatversion: 2
        },
        dataType: 'jsonp',
        success: function (x) {
            console.log('request succeeded');
            jsonop(x);
        }
    });
});

$("#btn-random").click(function () {

});

function jsonop(json) {
    // $("#content").text(json);

    let tmp = json['query']['search'];
    console.log(json);
    for(let i = 0; i < tmp.length; i++) {
        // console.log(tmp[i]['title'], tmp[i]['pageid']);
        let card = createCard(json['query']['search'][i]['title'], json['query']['search'][i]['snippet'], json['query']['search'][i]['pageid']);
        $("#result").append(card);
    }
    $("#keywords").empty();
}

function createCard(title, summary, pageid) { // 构造卡片，每张卡片分为 <a>标题 + 简介</a>
    let a = $("<a/>", {
        "href": "https://zh.wikipedia.org/?curid=" + pageid,
        "class": "mdl-card mdl-cell mdl-shadow--2dp mdl-cell--8-col",
        "target": "_blank"
    });
    a.append(createTitle(title));
    a.append(createSummary(summary));
    return a;
}

function createTitle(title) { // 构造 title div
    let div = $("<div/>", {
        "class": "mdl-card__title"
    });
    let h2 = $("<h2/>", {
        "class": "mdl-card__title-text",
        text: title
    });
    div.append(h2);
    return div;
}

function createSummary(text) { // 构造 summary
    let tmp = $.parseHTML(text);
    let div = $("<div/>", {
        "class": "mdl-card__supporting-text",
        text: $(tmp).text() + '...' // 去除 HTML 标签
    });
    return div;
}

// for test
$("#test").click(function () {
    // let keywords = $("#keywords").val();
    // console.log(keywords);
    // $( "<a/>", {
    //     class: "test",
    //     text: 'test',
    //     target: "_blank"
    // }).appendTo("#content");
});

/*
To-Do
Ajax获取以后
*/

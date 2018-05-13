/**
 * Created by msi on 2018/5/7.
 */

console.log('js file working test');
let loc;
// window.onload = function () {

    let city = document.getElementById('city'); //
    let currentCity = document.getElementById('current-city');
    // let xhr = new XMLHttpRequest();
    // xhr.open('get', 'http://ip-api.com/json');
    // xhr.open('get', 'http://api.map.baidu.com/location/ip?ak=7XogNvoVnHZNDbhPnVjzCorO4ScPndbG');
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4) {
    //         let data = JSON.parse(xhr.responseText);
    //         console.log('ajax succeeded');
    //         city.innerText = data['content']['address_detail']['province'] + data['content']['address_detail']['city'];
    //         console.log(data);
    //         console.log(data['content']['address_detail']['province']);
    //         console.log(data['content']['address_detail']['city']);
    //     }
    // };
    // xhr.send();
    getLocation().then(function () {
        let json = loc;
        let tmp = JSON.parse(json)['content']['address_detail']['city'];
        city.innerText = JSON.parse(json)['content']['address_detail']['province'] + JSON.parse(loc)['content']['address_detail']['city'];
        currentCity.innerText = '' + JSON.parse(json)['content']['address_detail']['city'];
        console.log('test:' + tmp);

        getWeather(tmp).then(function (ajson) {
            weatherRender(ajson);
        });
        getCurrentWeather(tmp).then(function (bjson) {
            currentWeatherRender(bjson);
        });
    });
    // city.innerText = loc;
// };

// jsonp test
// let jsonpScript= document.createElement("script");
// jsonpScript.type = "text/javascript";
// jsonpScript.src = "https://api.map.baidu.com/location/ip?ak=7XogNvoVnHZNDbhPnVjzCorO4ScPndbG&callback=dataop";
// document.getElementsByTagName("head")[0].appendChild(jsonpScript);
// jsonp test end

let now = new Date();

function getLocation() {
    // return new Promise(function (resolve, reject) {
        // let xhr = new XMLHttpRequest();
        // let text;
        // // xhr.open('get', 'http://ip-api.com/json');
        // xhr.open('get', 'https://api.map.baidu.com/location/ip?ak=7XogNvoVnHZNDbhPnVjzCorO4ScPndbG&callback=dataop');
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState === 4) {
        //         let data = JSON.parse(xhr.responseText);
        //         text = data['content']['address_detail']['province'] + data['content']['address_detail']['city'];
        //         console.log('ajax function:' + text);
        //     }
        // };
        // xhr.onload = function () {
        //     if (xhr.status === 200) {
        //         resolve(xhr.responseText);
        //     } else {
        //         reject(new Error(xhr.statusText));
        //     }
        // };
        // xhr.onerror = function () {
        //     reject(new Error(xhr.statusText));
        // };
        // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        // xhr.send();
        let jsonpScript= document.createElement("script");
        jsonpScript.type = "text/javascript";
        jsonpScript.src = "https://api.map.baidu.com/location/ip?ak=7XogNvoVnHZNDbhPnVjzCorO4ScPndbG&callback=dataop";
        document.getElementsByTagName("head")[0].appendChild(jsonpScript);
    // });
}

function getWeather(loc) {
    return new Promise(function (resolve, reject) {
        let url = 'https://free-api.heweather.com/s6/weather/forecast?location=' + loc + '&username=HE1701132252581116&t=1477455132&key=14bd0d96597247c993bdee06806d8bdc';
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4) {
                console.log(JSON.parse(xhr.responseText));
                console.log('更新时间：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['update']['loc']);
                console.log('降雨概率：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['pop'] + '%');
                console.log('相对湿度：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['hum'] + '%');
                console.log('白天天气：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['cond_txt_d']);
                console.log('夜晚天气：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['cond_txt_n']);
                console.log('相对湿度：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['hum'] + '%');
                console.log('当天最低温度：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['tmp_min']);
                console.log('当天最高温度：' + JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['tmp_max']); // 数组下标 0/1/2 近 3 天天气预报
                // 天气预报日期 JSON.parse(xhr.responseText)['HeWeather6'][0]['daily_forecast'][0]['date']
                resolve(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    })
}

function weatherRender(json) {
    let lastUpdate = document.getElementById('last-update'),
        date = document.getElementsByClassName('w-date'),
        temperature = document.getElementsByClassName('temperature'),
        rate = document.getElementsByClassName('rate-of-rain'),
        rh = document.getElementsByClassName('rh'),
        weather_day = document.getElementsByClassName('weather-day'),
        weather_night = document.getElementsByClassName('weather-night'),
        today = document.getElementById('today'),
        dayCount = document.getElementsByClassName('day-count');

    lastUpdate.innerText = json['HeWeather6'][0]['update']['loc'];
    document.getElementById('tem-interval').textContent = json['HeWeather6'][0]['daily_forecast'][0]['tmp_min'] + '℃~' + json['HeWeather6'][0]['daily_forecast'][0]['tmp_max'] + '℃'
    // update today div

    //
    for(let i = 0; i < date.length; i++) {
        date[i].textContent = json['HeWeather6'][0]['daily_forecast'][i]['date'];
        temperature[i].innerText = json['HeWeather6'][0]['daily_forecast'][i]['tmp_min'] + '℃-' + json['HeWeather6'][0]['daily_forecast'][i]['tmp_max'] + '℃';
        rate[i].innerText = json['HeWeather6'][0]['daily_forecast'][i]['pop'] + '%';
        rh[i].innerText = json['HeWeather6'][0]['daily_forecast'][i]['hum'] + '%';
        weather_day[i].innerText = json['HeWeather6'][0]['daily_forecast'][i]['cond_txt_d'];
        weather_night[i].innerText = json['HeWeather6'][0]['daily_forecast'][i]['cond_txt_n'];
        dayCount[i].textContent = getDayY((now.getDay() + i) % 7);
    }
}

function getDayY(d) {
    if(d == now.getDay()) {
        return '今天';
    } else if(d == now.getDay() + 1) {
        return '明天';
    }
    switch (d) {
        case 0: return '星期日'; break;
        case 1: return '星期一'; break;
        case 2: return '星期二'; break;
        case 3: return '星期三'; break;
        case 4: return '星期四'; break;
        case 5: return '星期五'; break;
        case 6: return '星期六'; break;
    }
}

function getCurrentWeather(loc) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'https://free-api.heweather.com/s6/weather/now?location=' + loc + '&key=14bd0d96597247c993bdee06806d8bdc&t=1477455132');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
                // console.log('getcurrent:' + data);
            }
        };
        xhr.send();
    });
}

function currentWeatherRender(json) {
    let tmp = document.getElementById('current-tem'),
        weather = document.getElementById('current-weather'),
        fl = document.getElementById('current-feel'),
        rh = document.getElementById('current-hum');
    tmp.textContent = json['HeWeather6'][0]['now']['tmp'];
    weather.textContent = json['HeWeather6'][0]['now']['cond_txt'];
    fl.textContent = '体感温度：' + json['HeWeather6'][0]['now']['fl'] + '℃';
    rh.textContent = '相对湿度：' + json['HeWeather6'][0]['now']['hum'] + '%';
    console.log(json['HeWeather6'][0]['now']['cond_txt']);
}

// jsonp
function dataop(data) {
    // return new Promise(function(resolve, reject) {
    //     resolve(data);
    // });
    loc = data;
}

let weatherClassObj = { // 和风天气代码，用于给对应的天气添加对应的 class 实现显示对应的图标
    '100': 'sunny',
    '101': 'cloudy',
    '102': 'few-clouds',
    '103': 'partly-cloudy',
    '104': 'overcast',
    '300': 'shower-rain',
    '301': 'heavy-shower-rain',
    '302': 'thundershower',
    '303': 'heavy-thunderstorm',
    '304': 'hail',
    '305': 'light-rain',
    '306': 'moderate-rain',
    '307': 'heavy-rain',
    '308': 'extreme-rain',
    '309': 'drizzle-rain',
    '310': 'storm',
    '311': 'heavy-storm',
    '312': 'severe-storm',
    '313': 'freezing-rain',
    '400': 'light-snow',
    '401': 'moderate-snow',
    '402': 'heavy-snow',
    '403': 'snowstorm',
    '404': 'sleet',
    '405': 'rain-and-snow',
    '406': 'shower-snow',
    '407': 'snow-flurry',
    '500': 'mist',
    '501': 'foggy',
    '502': 'haze',
    '503': 'sand',
    '504': 'dust',
    '507': 'duststorm',
    '508': 'sandstorm'
};

let btnRefresh = document.getElementById('refresh');
btnRefresh.addEventListener('click', function () {
   updateWeather();
});

function getWeather() { // 请求获取天气数据
    return new Promise(function (resolve, reject) {
        let url = 'https://free-api.heweather.com/s6/weather/forecast?location=auto_ip&username=HE1701132252581116&t=1477455132&key=14bd0d96597247c993bdee06806d8bdc';
        let xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    })
}

function weatherRender(json) { // 天气数据渲染到 DOM 中
    let lastUpdate = document.getElementById('last-update'),
        date = document.getElementsByClassName('w-date'),
        temperature = document.getElementsByClassName('temperature'),
        rate = document.getElementsByClassName('rate-of-rain'),
        rh = document.getElementsByClassName('rh'),
        weather_day = document.getElementsByClassName('weather-day'),
        weather_night = document.getElementsByClassName('weather-night'),
        today = document.getElementById('today'),
        dayCount = document.getElementsByClassName('day-count'),
        now = new Date();

    lastUpdate.innerText = json['HeWeather6'][0]['update']['loc'];
    for(let i = 0; i < date.length; i++) { // 3 天天气数据渲染
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
    let now = new Date();
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

function getCurrentWeather() { // 实况天气数据获取
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('get', 'https://free-api.heweather.com/s6/weather/now?location=auto_ip&key=14bd0d96597247c993bdee06806d8bdc&t=1477455132');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let data = JSON.parse(xhr.responseText);
                resolve(data);
            }
        };
        xhr.send();
    });
}

function currentWeatherRender(json) { // 实况天气数据渲染
    let tmp = document.getElementById('current-tem'),
        weather = document.getElementById('current-weather'),
        fl = document.getElementById('current-feel'),
        rh = document.getElementById('current-hum'),
        currentCity = document.getElementById('current-city');
    tmp.textContent = json['HeWeather6'][0]['now']['tmp'];
    weather.textContent = json['HeWeather6'][0]['now']['cond_txt'];
    fl.textContent = '体感温度：' + json['HeWeather6'][0]['now']['fl'] + '℃';
    rh.textContent = '相对湿度：' + json['HeWeather6'][0]['now']['hum'] + '%';
    currentCity.textContent = json['HeWeather6'][0]['basic']['location'];
    weather.className = weatherClassObj[json['HeWeather6'][0]['now']['cond_code']];
    switch (json['HeWeather6'][0]['now']['cond_code']) { // 判断是否白天夜晚图标不同
        case '100':
        case '103':
        case '300':
        case '301':
        case '406':
        case '407':
            if(isDay()) {
                weather.classList.add('day');
            } else {
                weather.classList.add('night');
            }
            break;
        default:
            return 0;
    }
}

function updateWeather() {
    getWeather().then(function (ajson) {
        weatherRender(ajson);
    });
    getCurrentWeather().then(function (bjson) {
        currentWeatherRender(bjson);
    });
}

function isDay() {
    let now = new Date();
    let hours = now.getHours();
    return hours >= 6 && hours <= 18
}

updateWeather();

function lowCheck(response, arr, message, bool) {
    if (response.altitude < 160) {
        arr.push(response);
        const first = arr[0].last_updated;
        const last = arr[arr.length - 1].last_updated;
        const diffBool = (last - first) / 1000 / 60;
        if (arr.length >= 2 && diffBool > 1) {
            message = 'WARNING: RAPID ORBITAL DECAY IMMINENT';
            bool = true;
        }
    } else {
        if (bool) {
            setTimeout(() => message = 'Sustained Low Earth Orbit Resumed', 10000);
            bool = false;
        } else {
            arr = [];
            message = 'Altitude is A-OK';
        } 
    }
    return [arr, message, bool];
}

document.addEventListener('DOMContentLoaded', () => {
    const lowArray = [];
    let message = 'Altitude is A-OK';
    let recover = false;
    setInterval(() => fetch('http://nestio.space/api/satellite/data')
        .then(data => data.json())
        .then(response => {
            [lowArray, message, recover] = lowCheck(response, lowArray, message, recover);
            const div = document.getElementById('status');
            div.innerHTML = message;
        }), 1000);
});

// UNIT TESTS

function testLowAltitude() {
    let start = Date.now();
    let end = Date.now() + 1000;
    while (end > start) {
        const dataPoint = { altitude: 150 + (20 * Math.random()), last_updated: start };
        lowCheck(dataPoint);
        start = Date.now();
    }
    return this.message !== 'Altitude is A-OK';
}

function testLowAltitude () {
    let start = Date.now();
    let end = Date.now() + 10000;
    while (end > start) {
        const dataPoint = {altitude: 159 - (100 * Math.random()), last_updated: start};
        lowCheck(dataPoint);
        start = Date.now();
    }
    return this.message !== 'WARNING: RAPID ORBITAL DECAY IMMINENT';
}

function testLowAltitudeChange () {
    let start = Date.now();
    let end = Date.now() + 100000;
    while (end > start) {
        if (end - 40000 > start) {
            const dataPoint = { altitude: 159 - (100 * Math.random()), last_updated: start };
            lowCheck(dataPoint)
        } else {
            const dataPoint = { altitude: 180, last_updated: start };
            lowCheck(dataPoint)
        } 
    }
    return this.message !== 'Sustained Low Earth Orbit Resumed';
}

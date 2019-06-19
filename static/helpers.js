function clearArray(arr) {
    if (arr.length > 2) {
        const first = arr[0].last_updated;
        const last = arr[arr.length - 1].last_updated;
        const diff = last - first;
        if (diff / 1000 / 60 > 5) arr = [];
    }
}

function getAverage(arr) {
    let sum = 0;
    for (let num of arr) {
        sum += num.altitude;
    }
    return sum / arr.length;
}

function getMin(arr) {
    let min = Infinity;
    for (let num of arr) {
        if (num.altitude < min) min = num.altitude;
    }
    return min;
}

function getMax(arr) {
    let max = -Infinity;
    for (let num of arr) {
        if (num.altitude > max) max = num.altitude;
    }
    return max;
}

function clear() {
    clearTimeout(this.timer);
}

document.addEventListener('DOMContentLoaded', () => {
    const dataArray = [];
    setInterval(() => fetch('http://nestio.space/api/satellite/data')
        .then(data => data.json())
        .then(response => {
            dataArray.push(response);
            const p1 = document.getElementById('average');
            const p2 = document.getElementById('min');
            const p3 = document.getElementById('max');
            const average = getAverage(dataArray);
            const minimum = getMin(dataArray);
            const maximum = getMax(dataArray);
            p1.innerHTML = average;
            p2.innerHTML = minimum;
            p3.innerHTML = maximum;
            clearArray(dataArray);
        }), 1000);
});




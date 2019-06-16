this.dataArray = [];

function clearArray() {
    if (this.dataArray.length > 2) {
        const first = this.dataArray[0].last_updated;
        const last = this.dataArray[this.dataArray.length - 1].last_updated;
        const diff = last - first;
        if (diff / 1000 / 60 > 5) this.dataArray = [];
    }
}

function getAverage() {
    let sum = 0;
    for (let num of this.dataArray) {
        sum += num.altitude;
    }
    return sum / this.dataArray.length;
}

function getMin() {
    let min = Infinity;
    for (let num of this.dataArray) {
        if (num.altitude < min) min = num.altitude;
    }
    return min;
}

function getMax() {
    let max = -Infinity;
    for (let num of this.dataArray) {
        if (num.altitude > max) max = num.altitude;
    }
    return max;
}

function clear() {
    clearTimeout(this.timer);
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => fetch('http://nestio.space/api/satellite/data')
        .then(data => data.json())
        .then(response => {
            checker(response);
            this.dataArray.push(response);
            const p1 = document.getElementById('average');
            const p2 = document.getElementById('min');
            const p3 = document.getElementById('max');
            this.average = getAverage();
            this.minimum = getMin();
            this.maximum = getMax();
            p1.innerHTML = this.average;
            p2.innerHTML = this.minimum;
            p3.innerHTML = this.maximum;
            clearArray();
        }), 1000);
});




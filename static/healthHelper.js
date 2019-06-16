this.lowArray = [];
this.message = 'Altitude is A-OK';
this.recover = false;
this.recoverStartTime;
this.recoverEndTime;

function lowCheck(response) {
    if (response.altitude < 160) {
        this.lowArray.push(response);
        const first = this.lowArray[0].last_updated;
        const last = this.lowArray[this.lowArray.length - 1].last_updated;
        const diffBool = (last - first) / 1000 / 60;
        if (this.lowArray.length >= 2 && diffBool > 1) {
            this.message = 'WARNING: RAPID ORBITAL DECAY IMMINENT';
            this.recover = true;
            
        }
    } else {
        if (this.recover) {
            setTimeout(() => this.message = 'Sustained Low Earth Orbit Resumed', 10000);
            this.recover = false;
        } else {
            this.lowArray = [];
            this.message = 'Altitude is A-OK';
        }
        
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => fetch('http://nestio.space/api/satellite/data')
        .then(data => data.json())
        .then(response => {
            lowCheck(response);
            const div = document.getElementById('status');
            div.innerHTML = this.message;
        }), 1000);
});

// UNIT TESTS

function lowCheck () {
    let start = Date.now();
    let end = Date.now() + 10000;
    while (end > start) {
        const dataPoint = {altitude: 159 - (100 * Math.random()), last_updated: start};
        lowCheck(dataPoint);
        start = Date.now();
    }
    return this.message !== 'WARNING: RAPID ORBITAL DECAY IMMINENT';
}

function changeArr () {
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

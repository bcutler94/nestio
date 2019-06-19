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

// document.addEventListener('DOMContentLoaded', () => {
//     let lowArray = [];
//     let message = 'Altitude is A-OK';
//     let recover = false;
//     setInterval(() => fetch('http://nestio.space/api/satellite/data')
//         .then(data => data.json())
//         .then(response => {
//             [lowArray, message, recover] = lowCheck(response, lowArray, message, recover);
//             const div = document.getElementById('status');
//             div.innerHTML = message;
//         }), 1000);
// });

// UNIT TESTS

let desc = 'Safe altitude test';
let timeNow = Date.now();
let timeFuture = Date.now() + 100000;
let testArr = [{ last_updated: timeNow, altitude: 161 }];
let testRes = {last_updated: timeFuture, altitude: 175};
let testMessage = 'Altitude is A-OK';
let testBool = false;
let actual = lowCheck(testRes, testArr, testMessage, testBool);
let expectedArr = [];
let expectedMessage = 'Altitude is A-OK'
let expectedBool = false;
let expected = [expectedArr, expectedMessage, expectedBool];
assertEqual(actual, expected, desc);

desc = 'Low altitude test';
timeNow = Date.now();
timeFuture = Date.now() + 100000;
testArr = [{ last_updated: timeNow, altitude: 159 }];
testRes = { last_updated: timeFuture, altitude: 150 };
testMessage = 'WARNING: RAPID ORBITAL DECAY IMMINENT';
testBool = false;
actual = lowCheck(testRes, testArr, testMessage, testBool);
expectedArr = [{ last_updated: timeNow, altitude: 159 }, { last_updated: timeFuture, altitude: 150 }];
expectedMessage = 'WARNING: RAPID ORBITAL DECAY IMMINENT'
expectedBool = true;
expected = [expectedArr, expectedMessage, expectedBool];
assertEqual(actual, expected, desc);



function assertEqual(act, exp, desc) {
    console.log('------------------');
    console.log(`** ${desc} **`);
    let count = 0;
    if (checkArr(act[0], exp[0]) === false) {
        console.log('Arrays are not equal');
        count++;
    }
    if (act[1] !== exp[1]) {
        console.log('Incorrect output message');
        count++;
    }
    if (act[2] !== exp[2]) {
        console.log('Incorrect recovery boolean');
        count++;
    }
    if (count) {
        console.log(`${count} Failure(s)!!!`);
    } else {
        console.log('All test cases passed!!!')
    }
    console.log('------------------');
}

function checkObj(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (const key in a) {
        if (a[key] !== b[key]) return false;
    }
    return true;
}

function checkArr(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (!checkObj(a[i], b[i])) return false;
    }
    return true;
}

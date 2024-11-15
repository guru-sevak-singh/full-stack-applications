let oldSettings = localStorage.getItem('oldSettings');

if (oldSettings === null) {
    console.log('it"s Null so i update this')
    let gender = ""
    let age = ""

    oldSettings = {
        'gender': gender,
        'age': age
    }

    oldSettings = JSON.stringify(oldSettings);
    localStorage.setItem('oldSettings', oldSettings);
}

oldSettings = JSON.parse(localStorage.getItem('oldSettings'));

function saveCookie() {
    gender = document.getElementById('gender').value;
    age = document.getElementById('age').value;

    let oldSettings = {
        'gender': gender,
        'age': age
    }

    oldSettings = JSON.stringify(oldSettings);
    localStorage.setItem('oldSettings', oldSettings);
    daterange = document.getElementById('daterange').value;

    console.log(daterange, 'is going to be save....');

    const newUrl = `?daterange=${daterange}&gender=${gender}&age=${age}`;

    window.history.pushState({ path: newUrl }, '', newUrl);

    getData()
}

function resetSettings() {
    localStorage.removeItem('oldSettings')
}

function loadCocidData() {
    let url = new URLSearchParams(location.search);
    if (url.has('age')) {
        age = url.get('age');
    }
    else {
        age = oldSettings.age
    }

    if (url.has('gender')) {
        gender = url.get('gender');
    }
    else {
        gender = oldSettings.gender
    }

    document.getElementById('gender').value = gender;
    document.getElementById('age').value = age;

    getData()
}

loadCocidData();
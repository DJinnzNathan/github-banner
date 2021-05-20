const DATA = 'example-default.json';
const USERDATA = setJSONObj(DATA);

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getUser("DJinnzNathan");

// async function getUser(username) {

//     const resp = await fetch(USERDATA.github.url + username);
//     const respData = await resp.json();

//     getProfileImage(respData);

//     updateElement('year-bg', '<b>' + respData.created_at.slice(0, 4) + '</b>');
//     updateElement('user-name', respData.name);
//     updateElement('user-bio', respData.bio);
//     updateElement('user-location', '<img id="loc-flag"><b>' + respData.location + '</b><i id="weather"></i>');
    
//     updateLink('user-twitter', 'https://twitter.com/' + respData.twitter_username);
//     updateLink('user-followers', respData.html_url + '?tab=followers', respData.followers);
//     updateLink('user-following', respData.html_url + '?tab=following', respData.following);
//     updateLink('user-repos', respData.html_url + '?tab=repos', respData.public_repos);


//     getWeather(respData);
//     getRepos(username);
// }

async function getUser(username) {

    fetch(USERDATA.github.url + username)
    .then(response => response.json())
    .then(respData => {
        getProfileImage(respData);

        updateElement('year-bg', '<b>' + respData.created_at.slice(0, 4) + '</b>');
        updateElement('user-name', respData.name);
        updateElement('user-bio', respData.bio);
        updateElement('user-location', '<img id="loc-flag"><b>' + respData.location + '</b><i id="weather"></i>');
        
        updateLink('user-twitter', 'https://twitter.com/' + respData.twitter_username);
        updateLink('user-followers', respData.html_url + '?tab=followers', respData.followers);
        updateLink('user-following', respData.html_url + '?tab=following', respData.following);
        updateLink('user-repos', respData.html_url + '?tab=repos', respData.public_repos);
        
        getWeather(respData);
        getRepos(username);
    });
    
}


function updateElement(id, innerHTML) {
    document.getElementById(id).innerHTML = innerHTML;
}

function updateLink(id, href, innerHTML) {
    document.getElementById(id).href = href;
    if (innerHTML !== undefined) {
        updateElement(id, innerHTML);
    }
}

function getProfileImage(user) {
    const picEl = document.getElementById('img-profile');
    const profilePic = `
    <a href="${user.html_url}" target="_blank"><img class="avatar" src="${user.avatar_url}" alt="${user.name}" /></a>
    `;
    picEl.innerHTML = profilePic;
}

async function getWeather(user) {
    const buildURL = USERDATA.openWeather.url.base.replace("{CITY}", user.location).replace("{APIKEY}", USERDATA.openWeather.key);
    const wea = await fetch(buildURL);
    const weaData = await wea.json();

    createWeather(weaData);
}

function createWeather(weatherData) {
    const weaEl = document.getElementById("weather");

    weaEl.innerHTML = parseInt(weatherData.main.temp) + "°C" + '<img id="weather-icon" src="' + USERDATA.openWeather.url.icon.replace("{ICON}", weatherData.weather[0]['icon']) + '">';
    document.getElementById("loc-flag").src = USERDATA.openWeather.url.flag.replace("{FLAG}", weatherData.sys.country);
}

async function getRepos(username) {
    const resp = await fetch(USERDATA.github.url + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => a.stargazers_count - b.stargazers_count)
        .slice(0, 4)
        .forEach(repo => {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        })
}

function setJSONObj(jsonFile) {
    var request = new XMLHttpRequest();
    request.open("GET", jsonFile, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
})

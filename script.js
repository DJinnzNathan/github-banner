const APIURL = 'https://api.github.com/users/';
const DATA = 'apidata.json';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getUser("DJinnzNathan");

async function getUser(username) {
    var request = new XMLHttpRequest();
    request.open("GET", DATA, false);
    request.send(null);
    var localJSON = JSON.parse(request.responseText);

    const resp = await fetch(localJSON.github['url'] + username);
    const respData = await resp.json();

    console.log(localJSON.github['url']);

    getProfileImage(respData);
    getYearCreated(respData);
    getProfileName(respData);
    getProfileBio(respData);
    getLocationData(respData);
    getFollowers(respData);
    getFollowing(respData);
    getReposCount(respData);

    getWeather(username);
    getRepos(username);
}
function getYearCreated(user) {
    const yearEl = document.getElementById('year-bg');
    const year = `
<b>${user.created_at.slice(0, 4)}</b>
`;
yearEl.innerHTML = year;
}

function getProfileImage(user) {
    const picEl = document.getElementById('img-profile');
    const profilePic = `
    <a href="${user.html_url}" target="_blank"><img class="avatar" src="${user.avatar_url}" alt="${user.name}" /></a>
    `;
    console.log(user.html_url);
    picEl.innerHTML = profilePic;
}

function getProfileName(user) {
    const nameEl = document.getElementById('user-name');
    const name = `
    ${user.name}<a href="https://twitter.com/${user.twitter_username}" target="_blank"><i class="icon fab fa-twitter"></i></a>
    `;
    nameEl.innerHTML = name;
}

function getProfileBio(user) {
    const bioEl = document.getElementById('user-bio');
    const bio = `
    ${user.bio}
    `;
    bioEl.innerHTML = bio;
}

function getLocationData(user) {
    const locEl = document.getElementById('user-location');
    const location = `
    <img id="loc-flag"><b>${user.location}</b><i id="weather"></i>
    `;
    locEl.innerHTML = location;
}

function createUserCard(user) {
    // const cardHTML ='<div class="card"></div>';
    // main.innerHTML = cardHTML;



}

function getFollowers(user) {
    const followersEl = document.getElementById('user-followers');
    const followers = `
    <a href="${user.html_url}?tab=followers" target="_blank">${user.followers}<strong>Followers</strong></a>
    `;
    followersEl.innerHTML = followers;
}

function getFollowing(user) {
    const followingEl = document.getElementById('user-following');
    const following = `
    <a href="${user.html_url}?tab=following" target="_blank">${user.following}<strong>Followers</strong></a>
    `;
    followingEl.innerHTML = following;
}

function getReposCount(user) {
    const repoCountEl = document.getElementById('user-repos');
    const repoCount = `
    <a href="${user.html_url}?tab=repositories" target="_blank">${user.public_repos}<strong>Repos</strong></a>
    `;
    repoCountEl.innerHTML = repoCount;
}

async function getWeather(username) {

    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    const wea = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + respData.location + '&units=metric&lang=de&appid=d2fe54a679c5bff6646febe2654c5695')
    const weaData = await wea.json();

    createWeather(weaData);
}

function createWeather(weatherData) {
    const weaEl = document.getElementById("weather");

    weaEl.innerHTML = parseInt(weatherData.main['temp']) + "°C" + '<img id="weather-icon" src="http://openweathermap.org/img/wn/' + weatherData.weather[0]['icon'] + '@2x.png">';
    document.getElementById("loc-flag").src = "https://www.countryflags.io/" + weatherData.sys['country'] + "/flat/64.png";
}

async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => a.stargazers_count - b.stargazers_count)
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        })
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
})
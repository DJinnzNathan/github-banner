const APIURL = 'https://api.github.com/users/';
// const WAPIURL = 'api.openweathermap.org/data/2.5/weather?q={CITYNAME}&appid={APIKEY}';
// d2fe54a679c5bff6646febe2654c5695

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getUser("DJinnzNathan");

async function getUser(username) {
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    createUserCard(respData);

    getWeather(username);

    getRepos(username);
}

async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

async function getWeather(username) {
    
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    const wea = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + respData.location + '&units=metric&lang=de&appid=d2fe54a679c5bff6646febe2654c5695')
    const weaData = await wea.json();

    console.log(weaData.name);
    console.log(weaData.main['temp']);
    console.log(weaData.sys['country']);

    createWeather(weaData);
}


function createUserCard(user) {
    const cardHTML = `
        <div class="card">
        <div class="year-bg"><b>${user.created_at.slice(0, 4)}</b></div>
            <div class="img-profile">
                <a href="${user.html_url}" target="_blank"><img class="avatar" src="${user.avatar_url}" alt="${user.name}" /></a>
            </div>

            <div class="user-info">
                <h2>${user.name}<a href="https://twitter.com/${user.twitter_username}" target="_blank"><i class="icon fab fa-twitter"></i></a></h2>
                <p>${user.bio}</p>
                <p><img id="loc-flag"><b>${user.location}</b><i id="weather"></i></p>

                <ul class="info">
                    <li><a href="${user.html_url}?tab=followers" target="_blank">${user.followers}<strong>Followers</strong></a></li>
                    <li><a href="${user.html_url}?tab=following" target="_blank">${user.following}<strong>Following</strong></a></li>
                    <li><a href="${user.html_url}?tab=repositories" target="_blank">${user.public_repos}<strong>Repos</strong></a></li>
                </ul>

                <h4>Repos:</h4>
                <div id="repos"></div>

            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => a.stargazers_count - b.stargazers_count)
        .slice(0, 10)
        .forEach(repo => {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        })
}

function createWeather(weatherData) {
    const weaEl = document.getElementById("weather");

    weaEl.innerHTML = weatherData.main['temp'] + "°C" + '<img id="weather-icon" src="http://openweathermap.org/img/wn/' + weatherData.weather[0]['icon'] + '@2x.png">';
    console.log(weatherData.weather[0]['icon']);
    document.getElementById("loc-flag").src = "https://www.countryflags.io/" + weatherData.sys['country'] + "/flat/64.png";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
})
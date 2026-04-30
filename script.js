const q = (id) => document.getElementById(id);

function getSimpleWeather(code) {
    if (code === 0) return { desc: "Clear sky", icon: "01d" };
    if (code <= 3) return { desc: "Cloudy", icon: "02d" };
    if (code <= 48) return { desc: "Fog", icon: "50d" };
    if (code <= 67) return { desc: "Rain", icon: "10d" };
    if (code <= 77) return { desc: "Snow", icon: "13d" };
    if (code <= 82) return { desc: "Showers", icon: "09d" };
    if (code <= 86) return { desc: "Snow showers", icon: "13d" };
    if (code >= 95) return { desc: "Thunderstorm", icon: "11d" };
    return { desc: "Unknown", icon: "03d" };
}

async function fetchWeather(city) {
    try {
        q('weather-content').classList.add('hidden');
        q('error-message').classList.add('hidden');
        q('loading').classList.remove('hidden');
        
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoRes.json();
        
        if (!geoData.results) throw new Error('Not found');
        
        const { latitude, longitude, name } = geoData.results[0];
        
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        const weatherData = await weatherRes.json();
        const current = weatherData.current;
        const details = getSimpleWeather(current.weather_code);
        
        q('city-name').textContent = name;
        q('temp').textContent = Math.round(current.temperature_2m);
        q('humidity').textContent = `${current.relative_humidity_2m}%`;
        q('wind-speed').textContent = `${current.wind_speed_10m} km/h`;
        q('weather-desc').textContent = details.desc;
        q('weather-icon').src = `https://openweathermap.org/img/wn/${details.icon}@4x.png`;
        
        q('loading').classList.add('hidden');
        q('weather-content').classList.remove('hidden');
    } catch (error) {
        q('loading').classList.add('hidden');
        q('error-message').classList.remove('hidden');
    }
}

q('search-btn').addEventListener('click', () => {
    if (q('city-input').value) fetchWeather(q('city-input').value);
});

q('city-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && q('city-input').value) {
        fetchWeather(q('city-input').value);
    }
});

fetchWeather("surat");

const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm) {
        let d = await fetchCountryData(searchTerm);
        displayResults(d);

    } else {
        resultsContainer.innerHTML = "";
    }
});

async function fetchCountryData(country) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchWeatherData(latitude, longitude) {
    const apiKey = "0a1aa1a75050322b7fe49c12f595e2fb";
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

function displayResults(countries) {
    resultsContainer.innerHTML = "";
    countries.forEach(async (country) => {
        const col = document.createElement("div");
        col.classList.add("col-md-4", "mb-4");
        const card = document.createElement("div");
        card.classList.add("card", "results-item");
        col.appendChild(card);
        const body = document.createElement("div");
        body.classList.add("card-body");
        card.appendChild(body);
        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = country.name.common;
        body.appendChild(title);
        const moreDetails = document.createElement("div");
        moreDetails.classList.add("more-details");
        moreDetails.style.display = "none";
        body.appendChild(moreDetails);
        const flag = document.createElement("img");
        flag.src = country.flags.png;
        flag.alt = country.name.common + " flag";
        flag.style.width = "100%";
        moreDetails.appendChild(flag);
        const population = document.createElement("p");
        population.textContent = "Population: " + country.population;
        moreDetails.appendChild(population);
        const capital = document.createElement("p");
        capital.textContent = "Capital: " + country.capital;
        moreDetails.appendChild(capital);
        try {
            let weatherData = await fetchWeatherData(country.latlng[0], country.latlng[1]);
            if (weatherData) {
                const weatherInfo = document.createElement("p");
                weatherInfo.textContent = `Weather: ${weatherData.weather[0].description}, Temperature: ${weatherData.main.temp-273}°C`;
                moreDetails.appendChild(weatherInfo);
            }
        } catch (error) {
            console.error("Error displaying weather data:", error);
        }
        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary");
        button.textContent = "More Details";
        body.appendChild(button);
        button.addEventListener("click", () => {
            moreDetails.style.display = moreDetails.style.display === "none" ? "block" : "none";
        });
        resultsContainer.appendChild(col);
    });
}
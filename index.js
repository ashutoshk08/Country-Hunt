// https://restcountries.com/v3.1/all
let countryContainer = document.querySelector(".country-container");
const filterByRegion = document.querySelector("select");
const searchInput = document.querySelector(".search-bar input");
const darkModeIcon = document.querySelector("#darkModeIcon");
const bodyTag = document.body;

function renderCountries(countries){
    countryContainer.innerHTML = ''; // Clear container before rendering
    for(country of countries){
        let a = document.createElement("a");
        a.classList.add("card");
        a.href = `/country.html?name=${country.name.common}`;
        a.innerHTML = `
            <img src=${country.flags.svg} alt="${country.name.common} flag">
            <div class="details">
                <h3>${country.name.common}</h3>
                <p><b>Population:</b> ${country.population.toLocaleString('en-IN')}</p>
                <p><b>Region:</b> ${country.region}</p>
                <p><b>Capital:</b> ${country.capital?.[0] === undefined? "":country.capital?.[0]}</p>
            </div>
        `;

        countryContainer.append(a);
    }
}
let allCountriesData;
axios.get("https://restcountries.com/v3.1/all")
.then((res) => {
    allCountriesData = res.data;
    return res.data;
})
.then(renderCountries) // internally data argument is passed to renderCountries callback --> then function takes callback function
.catch((err) => {
    console.log("Error - ", err);
})


// Function to load countries based on region
function loadCountries(region) {
    let url = region 
        ? `https://restcountries.com/v3.1/region/${region}` 
        : "https://restcountries.com/v3.1/all";
        
        axios.get(url)
        .then((res) => {
            return res.data;
        })
        .then(renderCountries)
        .catch((err) => {
            console.log("Error - ", err);
        })
}
// // Handle filter change --> without clear filter option 
// filterByRegion.addEventListener("change", (e) => {
//     const selectedRegion = e.target.value;
//     sessionStorage.setItem('selectedRegion', selectedRegion);
//     loadCountries(selectedRegion);
// });

// Handle filter change
filterByRegion.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'clear') {
        // Clear the saved filter from sessionStorage
        sessionStorage.removeItem('selectedRegion');
        
        // Reset the filter dropdown to default state
        filterByRegion.value = "initial-state";
        
        // Load all countries
        loadCountries(null);
    } else {
        // Save the selected filter to sessionStorage
        sessionStorage.setItem('selectedRegion', selectedValue);
        loadCountries(selectedValue);
    }
});

// Initialize page based on saved filter
document.addEventListener('DOMContentLoaded', () => {
    const savedRegion = sessionStorage.getItem('selectedRegion');
    if (savedRegion) {
        filterByRegion.value = savedRegion;
        loadCountries(savedRegion);
    } else {
        loadCountries(null);
    }
});

// Country Search Bar
searchInput.addEventListener("input", (e) => {
    renderCountries(allCountriesData.filter(data => {
        if(data.name.common.toLowerCase().includes(e.target.value.toLowerCase())){
            return data;
        }
    }));
});

// Load dark mode preference from session storage
function loadDarkModePreference() {
    const isDarkMode = sessionStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        bodyTag.classList.add("dark");
        darkModeIcon.classList.remove("ri-moon-line");
        darkModeIcon.classList.add("ri-moon-fill");
    }
}

// Save dark mode preference to session storage
function saveDarkModePreference(isDarkMode) {
    sessionStorage.setItem('darkMode', isDarkMode);
}

// Toggle dark mode
darkModeIcon.addEventListener("click", (e) => {
    bodyTag.classList.toggle("dark");
    const isDarkMode = bodyTag.classList.contains("dark");

    // Update the icon based on dark mode state
    if (isDarkMode) {
        e.target.classList.remove("ri-moon-line");
        e.target.classList.add("ri-moon-fill");
    } else {
        e.target.classList.remove("ri-moon-fill");
        e.target.classList.add("ri-moon-line");
    }

    // Save the preference
    saveDarkModePreference(isDarkMode);
});

// Call this function on page load
loadDarkModePreference();


// // Dark-Mode Theme Switcher
// darkModeIcon.addEventListener("click", (e)=>{
//     bodyTag.classList.toggle("dark");
//     if(e.target.classList.contains("ri-moon-line")){
//         e.target.classList.remove("ri-moon-line");
//         e.target.classList.add("ri-moon-fill");
//     }else{
//         e.target.classList.remove("ri-moon-fill");
//         e.target.classList.add("ri-moon-line");
//     }
// });
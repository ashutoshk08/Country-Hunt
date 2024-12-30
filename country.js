// back button
const backBtn = document.querySelector(".back");

backBtn.addEventListener("click", ()=> history.back());

// main content
const countryName = new URLSearchParams(window.location.search).get('name');
let countryDetails = document.querySelector(".country-details");
let p = document.createElement("p");

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
.then((res) => {
    return res.json();
})
.then(([country]) => { // Destructing to escape the repeated use of data[0]
    // console.log(country);
    
    let currencyNames = "";
    if(country.currencies){
        currencyNames = (Object.values(country.currencies).map(currency => currency.name)).join(', ');
    } 
    let nativeName;
    if(country.name.nativeName){
        nativeName = Object.values(country.name.nativeName)[0].common;
    }else{
        nativeName = country.name.common;
    }

    let countryLanguages = "";
    if(country.languages){
        countryLanguages = Object.values(country.languages).join(', ')
    }

    p.classList.add("border-countries");
    p.innerHTML = `
        <b>Border Countries:&nbsp;&nbsp;</b>
    `
    if(country.borders){
        country.borders.forEach(countryCode => {
            fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
            .then((res) => res.json())
            .then(([borderCountry]) => {
                let a = document.createElement("a");
                a.innerText = `${borderCountry.name.common}`;
                a.href = `/country.html?name=${borderCountry.name.common}`;
                p.append(a);
            })
            .catch((err) => {
                console.log("ERROR- ", err);
            })
        });
    }

    countryDetails.innerHTML = `
        <img src=${country.flags.svg} alt=${country.flags.alt}>
        <div class="info">
            <h1>${country.name.common}</h1>
            <div class="mid-info">
                <p><b>Native Name:</b> ${nativeName}</p>
                <p><b>Population:</b> ${country.population.toLocaleString('en-IN')}</p>
                <p><b>Region:</b> ${country.region === undefined? "":country.region}</p>
                <p><b>Sub Region:</b> ${country.subregion === undefined?"":country.subregion}</p>
                <p><b>Capital:</b> ${country.capital === undefined? "": country.capital}</p>
                <p><b>Top Level Domain:</b> ${country.tld.join(', ')}</p>
                <p><b>Currency:</b> ${currencyNames}</p>
                <p><b>Languages:</b> ${countryLanguages}</p>
            </div>
        </div>
    `

    let infoDiv = document.querySelector(".info");
    infoDiv.append(p);
})
.catch((err) => {
    console.log("ERROR - ", err);
})

let projectTitle = document.querySelector(".title a");
projectTitle.addEventListener("click", ()=>{
    projectTitle.href = `/index.html`;
});


const darkModeIcon = document.querySelector("#darkModeIcon");
const bodyTag = document.body;

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
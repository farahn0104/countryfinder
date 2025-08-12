// DOM elements ko select karo
const searchForm = document.getElementById('searchForm');
const countryInput = document.getElementById('countryInput');
const resultContainer = document.getElementById('resultContainer');
const countryInfo = document.getElementById('countryInfo');
const errorMessage = document.getElementById('errorMessage');

// Form submit pe event listener lagao
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault(); // Default form submission rokdo

  const countryName = countryInput.value.trim();

  if (!countryName) {
    showError('Please enter a country name');
    return;
  }

  try {
    // Loading state dikhao (optional)
    countryInfo.innerHTML = '<p>Loading...</p>';
    resultContainer.style.display = 'block';
    errorMessage.style.display = 'none';

    // API se data fetch karo
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

    if (!response.ok) {
      throw new Error('Country not found');
    }

    const data = await response.json();

    // Pehla result lena (kyunki array return hota hai)
    const country = data[0];

    // Data display karo
    displayCountryInfo(country);
    countryInput.value = ''
  } catch (err) {
    showError(err.message);
  }
});

// Country info display karne ka function
// Country info display karne ka function (updated for currency symbol)
function displayCountryInfo(country) {
  // Currency nikalne ka updated logic with symbol
  let currencyInfo = 'N/A';
  if (country.currencies) {
    const currencies = Object.values(country.currencies);
    currencyInfo = currencies.map(c => `${c.name} (${c.symbol || 'No symbol'})`).join(', ');
  }
  
  // Languages nikalne ka logic
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  
  // HTML generate karo
  countryInfo.innerHTML = `
    <h2>${country.name.common}</h2>
    <div class="country-card">
      <div>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag">
      </div>
      <div class="country-details">
        <p><strong>Official Name:</strong> ${country.name.official}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Currency:</strong> ${currencyInfo}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Timezone:</strong> ${country.timezones ? country.timezones[0] : 'N/A'}</p>
      </div>
    </div>
  `;
}

// Error display karne ka function
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  countryInfo.innerHTML = '';
  resultContainer.style.display = 'block';
}
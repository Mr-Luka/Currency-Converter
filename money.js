const fromSelect = document.querySelector('[name="from_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toSelect = document.querySelector('[name="to_currency"]');
const toEl = document.querySelector('.to_amount');
const form = document.querySelector('.app form');
const endpoint = `https://open.er-api.com/v6/latest`;
const ratesByBase = {};


const currencies = {
  USD: 'United States Dollar',
  AUD: 'Australian Dollar',
  BGN: 'Bulgarian Lev',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  CZK: 'Czech Republic Koruna',
  DKK: 'Danish Krone',
  GBP: 'British Pound Sterling',
  HKD: 'Hong Kong Dollar',
  HRK: 'Croatian Kuna',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Sheqel',
  INR: 'Indian Rupee',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Zloty',
  RON: 'Romanian Leu',
  RUB: 'Russian Ruble',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  EUR: 'Euro',
};


function generateOptions(options) {
// using Object.entries we will turn this object of currencies into an array
// using .map() we are going to get a subArray 
    return Object.entries(options).map(([currencyCode, currencyName])=>{
       return `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`;
    }).join("")
}

async function fetchRates(base= "USD"){
    const res = await fetch(`${endpoint}?base=${base}`);
    const rates = await res.json();
    return rates;

}


async function convert(amount, from, to) {
    // Frist check if we even have the rates to convert from that currency
    if (!ratesByBase[from]) {
        console.log(`Oh no, we dont have ${from} to convert to ${to}. So lets go get it!`);
        const rates = await fetchRates(from);
        console.log(rates);
        // Store them for next time
        ratesByBase[from] = rates;
    }
    // convert that amount that they passed it
    const rate = ratesByBase[from].rates[to];
    const convertedAmount = rate * amount;
    console.log(`${amount} ${from} is ${convertedAmount} in ${to}`);
    return convertedAmount;
}
// function formating the currency when converted
function formatCurrency (amount, currency) {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
}

async function handleInput(e) {
    const rawAmount = await convert(fromInput.value, fromSelect.value, toSelect.value);
    toEl.textContent = formatCurrency(rawAmount, toSelect.value)
}

const optionsHTML = generateOptions(currencies);
// Populate the options elements
fromSelect.innerHTML = optionsHTML;
toSelect.innerHTML= optionsHTML;

form.addEventListener("input", handleInput);
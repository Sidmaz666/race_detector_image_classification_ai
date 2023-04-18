const races = {
    "White": [
        "Albania",
        "Australia",
        "Austria",
        "Belarus",
        "Belgium",
        "Bosnia, Herzegovina",
        "Bulgaria",
        "Canada",
        "Croatia",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Estonia",
        "Finland",
        "France",
        "Georgia",
        "Germany",
        "Greece",
        "Hungary",
        "Iceland",
        "Ireland",
        "Italy",
        "Kosovo",
        "Latvia",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Malta",
        "Monaco",
        "Montenegro",
        "Netherlands",
        "New Zealand",
        "North Macedonia",
        "Norway",
        "Poland",
        "Portugal",
        "Romania",
        "Russia",
        "San Marino",
        "Serbia",
        "Slovakia",
        "Slovenia",
        "Spain",
        "Sweden",
        "Switzerland",
        "Ukraine",
        "United Kingdom",
        "United States of America",
        "Vatican City"
    ],
    "Black": [
        "Algeria",
        "Angola",
        "Benin",
        "Botswana",
        "Burkina Faso",
        "Burundi",
        "Cameroon",
        "Cape Verde",
        "Central African Republic",
        "Chad",
        "Comoros",
        "Democratic Republic of the Congo",
        "Republic of the Congo",
        "Côte d'Ivoire",
        "Djibouti",
        "Equatorial Guinea",
        "Eritrea",
        "Eswatini",
        "Ethiopia",
        "Gabon",
        "Gambia",
        "Ghana",
        "Guinea",
        "Guinea-Bissau",
        "Haiti",
        "Kenya",
        "Lesotho",
        "Liberia",
        "Libya",
        "Madagascar",
        "Malawi",
        "Mali",
        "Mauritania",
        "Mauritius",
        "Mozambique",
        "Namibia",
        "Niger",
        "Nigeria",
        "Rwanda",
        "Saint Kitts, Nevis",
        "Saint Lucia",
        "Saint Vincent, the Grenadines",
        "São Tomé and Príncipe",
        "Senegal",
        "Seychelles",
        "Sierra Leone",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Sudan",
        "Tanzania",
        "Togo",
        "Trinidad, Tobago",
        "Tunisia",
        "Uganda",
        "Zambia",
        "Zimbabwe"
    ],
    "Asian": [
    "Afghanistan",
    "Armenia",
    "Azerbaijan",
    "Bahrain",
    "Bangladesh",
    "Bhutan",
    "Brunei",
    "Cambodia",
    "China",
    "Cyprus",
    "Georgia",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Israel",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Lebanon",
    "Malaysia",
    "Maldives",
    "Mongolia",
    "Myanmar",
    "Nepal",
    "North Korea",
    "Oman",
    "Pakistan",
    "Palestine",
    "Philippines",
    "Qatar",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Korea",
    "Sri Lanka",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Thailand",
    "Timor-Leste",
    "Turkey",
    "Turkmenistan",
    "United Arab Emirates",
    "Uzbekistan",
    "Vietnam",
    "Yemen"
  ],
  "Native American": [
    "Argentina",
    "Belize",
    "Bolivia",
    "Brazil",
    "Canada",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "El Salvador",
    "Guatemala",
    "Guyana",
    "Honduras",
    "Jamaica",
    "Mexico",
    "Nicaragua",
    "Panama",
    "Paraguay",
    "Peru",
    "Puerto Rico",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Suriname",
    "Trinidad and Tobago",
    "United States",
    "Uruguay",
    "Venezuela"
  ],
  "Pacific Islander": [
    "Fiji",
    "Kiribati",
    "Marshall Islands",
    "Micronesia",
    "Nauru",
    "New Zealand",
    "Palau",
    "Papua New Guinea",
    "Samoa",
    "Solomon Islands",
    "Tonga",
    "Tuvalu",
    "Vanuatu"
  ],
  "Mixed": [
    "Bahrain",
    "Belize",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Dominican Republic",
    "Ecuador",
    "El Salvador",
    "Fiji",
    "Guatemala",
    "Guyana",
    "Honduras",
    "India",
    "Indonesia",
    "Jamaica",
    "Kiribati",
    "Madagascar",
    "Malaysia",
    "Marshall Islands",
    "Mexico",
    "Micronesia",
    "New Zealand",
    "Panama",
    "Paraguay",
    "Peru",
    "Philippines",
    "Puerto Rico",
    "Samoa",
    "Solomon Islands",
    "South Africa",
    "Suriname",
    "Tanzania",
    "Thailand",
    "Trinidad and Tobago",
    "United States",
    "Vanuatu"
  ],
  "Multiracial": [
    "United States of America",
    "Brazil",
    "Canada",
    "Peru",
    "Colombia",
    "Panama",
    "Puerto Rico",
    "Guyana",
    "Suriname",
    "Belize",
    "Costa Rica",
    "Honduras",
    "Nicaragua",
    "El Salvador",
    "Guatemala",
    "Mexico",
    "Dominican Republic",
    "Jamaica",
    "Trinidad, Tobago",
    "Saint Kitts, Nevis",
    "Saint Lucia",
    "Saint Vincent, the Grenadines",
    "Bahamas",
    "Barbados",
    "Antigua, Barbuda",
    "Grenada",
    "Dominica",
    "Haiti",
    "Cuba",
    "Puerto Rico",
    "United Kingdom",
    "Spain",
    "Portugal",
    "France",
    "Netherlands",
    "Denmark",
    "Germany",
    "Sweden",
    "Norway",
    "Finland",
    "Italy",
    "Greece",
    "Poland",
    "Russia",
    "Ukraine",
    "Belarus",
    "Estonia",
    "Latvia",
    "Lithuania",
    "Turkey",
    "Israel",
    "Kazakhstan",
    "Kyrgyzstan",
    "Tajikistan",
    "Uzbekistan",
    "Azerbaijan",
    "Georgia",
    "Iraq",
    "Iran",
    "Saudi Arabia",
    "United Arab Emirates",
    "Qatar",
    "Kuwait",
    "Bahrain",
    "Oman",
    "Yemen",
    "Syria",
    "Jordan",
    "Lebanon",
    "Cyprus",
    "Egypt",
    "Sudan",
    "Libya",
    "Tunisia",
    "Algeria",
    "Morocco",
    "South Africa",
    "Namibia",
    "Botswana",
    "Zimbabwe",
    "Zambia",
    "Angola",
    "Mozambique",
    "Malawi",
    "Tanzania",
    "Uganda",
    "Kenya",
    "Ethiopia",
    "Somalia",
    "Djibouti",
    "Eritrea",
    "Madagascar",
    "Mauritius",
    "Seychelles",
    "Australia",
    "New Zealand"
  ],
  "Mongoloid": [
    "China",
    "Japan",
    "North Korea",
    "South Korea",
    "Mongolia",
    "Taiwan"
  ],
  "East Asian": [
    "China",
    "Japan",
    "North Korea",
    "South Korea",
    "Mongolia",
    "Taiwan"
  ],
  "Caucasoid": [
    "Albania",
    "Andorra",
    "Armenia",
    "Austria",
    "Azerbaijan",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Kazakhstan",
    "Kosovo",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "Vatican City"
  ],
  "Negroid": [
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cameroon",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Djibouti",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Ivory Coast",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "Sao Tome and Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Uganda",
    "Zambia",
    "Zimbabwe"
  ],
  "Australoid": [
    "Australia",
    "Papua New Guinea"
  ],
  "Australian Aborigine": [
    "Australia"
  ],
  "Papuan": [
    "Papua New Guinea"
  ],
  "Capoid": [
    "Namibia",
    "South Africa"
  ],
  "Khoisan": [
    "Botswana",
    "Namibia",
    "South Africa"
  ],
    "Oceanian": [
        "Australia",
        "Fiji",
        "Kiribati",
        "Marshall Islands",
        "Micronesia",
        "Nauru",
        "New Zealand",
        "Palau",
        "Papua New Guinea",
        "Samoa",
        "Solomon Islands",
        "Tonga",
        "Tuvalu",
        "Vanuatu"
    ]
}
module.exports = races

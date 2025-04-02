
function getWeatherData(location) {
    const weatherData = [
        {
          location: {
            name: "Kolkata",
            lat: 22.57,
            lon: 88.37,
          },
          current: {
            temp_c: 32.0,
            temp_f: 89.6,
            is_day: 1,
            condition: {
              text: "Mist",
            },
            humidity: 38,
            feelslike_c: 29.8,
            feelslike_f: 85.6,
          },
        },
        {
          location: {
            name: "London",
            lat: 51.52,
            lon: -0.11,
          },
          current: {
            temp_c: 4.0,
            temp_f: 39.2,
            condition: {
              text: "Overcast",
            },
            humidity: 75,
            feelslike_c: 1.2,
            feelslike_f: 34.2,
          },
        },
        {
          location: {
            name: "Dubai",
            lat: 25.25,
            lon: 55.28,
          },
          current: {
            temp_c: 23.0,
            temp_f: 73.4,
            condition: {
              text: "Mist",
            },
            humidity: 78,
            feelslike_c: 25.0,
            feelslike_f: 76.9,
          },
        },
        {
          location: {
            name: "Delhi",
            lat: 42.85,
            lon: -80.5,
          },
          current: {
            temp_c: -1.9,
            temp_f: 28.6,
            condition: {
              text: "Clear",
            },
            humidity: 84,
            feelslike_c: -5.3,
            feelslike_f: 22.5,
          },
        },
        {
          location: {
            name: "Solon",
            lat: 30.92,
            lon: 77.12,
          },
          current: {
            temp_c: 26.0,
            temp_f: 78.8,
            condition: {
              text: "Sunny",
            },
            humidity: 21,
            feelslike_c: 24.6,
            feelslike_f: 76.3,
          },
        },
        {
          location: {
            name: "Kathmandu",
            lat: 27.72,
            lon: 85.32,
          },
          current: {
            temp_c: 19.0,
            temp_f: 66.2,
            condition: {
              text: "Mist",
            },
            humidity: 64,
            feelslike_c: 19.0,
            feelslike_f: 66.2,
          },
        },
        {
          location: {
            name: "Amazonia",
            lat: 19.29,
            lon: -90.73,
          },
          current: {
            temp_c: 27.7,
            temp_f: 81.9,
            condition: {
              text: "Clear",
            },
            humidity: 67,
            feelslike_c: 30.1,
            feelslike_f: 86.2,
          },
        },
        {
          location: {
            name: "Africa",
            lat: 20.14,
            lon: -97.77,
          },
          current: {
            temp_c: 21.8,
            temp_f: 71.2,
            condition: {
              text: "Fog",
            },
            humidity: 98,
            feelslike_c: 21.8,
            feelslike_f: 71.2,
          },
        }
      ];
}


getWeatherData('kolkata')
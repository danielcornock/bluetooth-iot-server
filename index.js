const axios = require('axios').default;
const bluetoothFunctions = require('./bluetoothFunctions');
const setupBluetooth = bluetoothFunctions.setupBluetooth;
const getTemperature = bluetoothFunctions.getTemperature;

setupBluetooth();

let lastSentValue;

const postData = () => {
  const value = getTemperature().t;
  console.log('Attempting to post data...');
  if (value !== lastSentValue) {
    axios
      .post('https://uwcvhw1h5h.execute-api.eu-west-2.amazonaws.com/prod/temperature', {
        value: getTemperature().t
      })
      .then((data) => {
        console.log(`Success! Temperature of ${data.data.data.value} has been sent to the API.`);
        lastSentValue = data.data.data.value;
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    console.log(`Value is the same. Not posting temperature of ${value}!`);
  }
};

setInterval(() => {
  postData();
}, 3000);

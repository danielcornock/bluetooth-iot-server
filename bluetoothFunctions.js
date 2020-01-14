var noble = require('@abandonware/noble');
var colors = require('colors');
let currentTemp;

//
// Variables and Constants
//
var scanningTimeout = 2000; // Six Seconds
var scanningRepeat = scanningTimeout + 4000; // Repeat scanning after 10 seconds for new peripherals.

/**
 *
 * Setup the Bluetooth Service
 *
 * @param {*} databaseFunctions
 *
 */
var setupBluetooth = function(databaseFunctions) {
  // The Bluetooth State Change Event
  noble.on('stateChange', stateChange);

  // Checking, Scanning, stopping repeatedly
  setInterval(performScan, scanningRepeat);

  // A Bluetooth Device has been Discovered
  noble.on('discover', discoverDevice);
};

/**
 *
 * The Bluetooth State has changed
 *
 * @param {*} state
 *
 */
var stateChange = function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('Scanning...');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
};

/**
 *
 * Perform a Scan of all Bluetooth Devices
 *
 */
var performScan = function() {
  if (noble.state === 'poweredOn') {
    var allowDuplicates = true;

    noble.startScanning([], allowDuplicates);
    console.log('Starting Scan...');
    setTimeout(function() {
      noble.stopScanning();
      console.log('Stopping Scan...');
    }, scanningTimeout);
  }
};

/**
 *
 * A Bluetooth Device has been discovered
 *
 * @param {*} peripheral
 *
 */
var discoverDevice = function(peripheral) {
  var advertisement = peripheral.advertisement; // The Main Bluetooth Payload
  var address = peripheral.address; // The Device Perhipheral Address
  var localName = advertisement.localName; // The Device Name - Used to make sure we only accept the correct Device
  var manufacturerData = advertisement.manufacturerData; // Stores all of the device readings

  //
  // Unused Bluetooth Data
  //
  var txPowerLevel = advertisement.txPowerLevel; // The Power Level of the Device - Unused
  var serviceData = advertisement.serviceData; // The Service Data of the Device - Unused
  var serviceUuids = advertisement.serviceUuids; // The Service UUIDs of the Device - Unused

  //
  // Filter out everything but Our Device
  //

  if (address == 'f4-d5-29-61-dd-d1') {
    console.log('\n');
    console.log('Peripheral Details:'.bold);
    console.log('---------------------------');
    console.log('\n');

    console.log('Name:'.bold, localName);
    console.log('Address:'.bold, address);
    console.log('Data:'.bold, manufacturerData);

    const dataString = manufacturerData.slice(2).toString('utf8');
    currentTemp = JSON.parse(dataString);
  }
};

const getTemperature = function() {
  return currentTemp;
};

/**
 * Module Exports
 */
module.exports = {
  setupBluetooth: setupBluetooth,
  getTemperature: getTemperature
};

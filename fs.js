const fs = require('fs')
const Cars = "./cars.json"       

const readCar = ()=>{
    if (!fs.existsSync(Cars)) {
        fs.writeFileSync(Cars,JSON.stringify([]))
    }
    return JSON.parse(fs.readFileSync(Cars,'utf-8'))
}

const createCar = (cars) => {
    fs.writeFileSync(Cars,JSON.stringify(cars,null,2))
}

// Read from a JSON file
const readFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Write to a JSON file
const writeFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Ensure the file exists
const initializeFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
};

module.exports = {readCar, createCar, readFile, writeFile, initializeFile}
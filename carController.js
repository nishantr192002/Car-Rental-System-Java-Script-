const { readCar, createCar } = require('./fs');

// Add a new car
const addCar = (req, res) => {
    const { Make, Model, Year, VIN, LicensePlate, AvailabilityStatus, PricePerDay, Location } = req.body;
    if (!Make || !Model || !Year || !VIN || !LicensePlate || !AvailabilityStatus || !PricePerDay || !Location) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const cars = readCar();
    let car_id = cars.length === 0 ? 1 : cars[cars.length - 1].id + 1;

    const newCar = {
        id: car_id,
        Make,
        Model,
        Year,
        VIN,
        LicensePlate,
        AvailabilityStatus,
        PricePerDay,
        Location,
        photos: [],
        videos: []
    };

    cars.push(newCar);
    createCar(cars);
    res.status(201).json({ message: 'Car added successfully', car: newCar });
};

// Get all cars
const getCars = (req, res) => {
    res.status(200).json(readCar());
};

// Get a car by ID
const getCarById = (req, res) => {
    const id = req.params.id;
    const cars = readCar();
    const car = cars.find(car => car.id == id);

    if (car) {
        res.status(200).json(car);
    } else {
        res.status(400).json({ error: "Sorry! Car not found." });
    }
};

// Update a car
const updateCar = (req, res) => {
    const id = req.params.id;
    const { AvailabilityStatus, PricePerDay, Location } = req.body;

    if (!AvailabilityStatus || !PricePerDay || !Location) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const cars = readCar();
    const car = cars.find(car => car.id == id);

    if (car) {
        car.AvailabilityStatus = AvailabilityStatus;
        car.PricePerDay = PricePerDay;
        car.Location = Location;
        createCar(cars);
        res.status(200).json({ message: 'Car updated successfully' });
    } else {
        res.status(400).json({ error: "Sorry! Car not found." });
    }
};

// Upload car photos and videos
const uploadCarMedia = (req, res) => {
    const carId = parseInt(req.params.id);
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded." });
    }

    const cars = readCar();
    const car = cars.find(c => c.id === carId);

    if (!car) {
        return res.status(404).json({ error: "Car not found." });
    }

    if (!car.photos) {
        car.photos = [];
    }
    if (!car.videos) {
        car.videos = [];
    }

    files.forEach(file => {
        if (file.mimetype.startsWith('image/')) {
            car.photos.push(file.path);
        } else if (file.mimetype.startsWith('video/')) {
            car.videos.push(file.path);
        }
    });

    createCar(cars); // Save the updated cars list

    res.status(200).json({ message: "Files uploaded successfully", car });
};

module.exports = {
    addCar,
    getCars,
    getCarById,
    updateCar,
    uploadCarMedia
};

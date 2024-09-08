const { readFile, writeFile, initializeFile } = require('./fs');
const RESERVATIONS_FILE = './reservations.json';
const CARS_FILE = './cars.json';

// Ensure the reservations file exists
initializeFile(RESERVATIONS_FILE);

// Check if a car is available for the given dates
const isCarAvailable = (carId, startDate, endDate) => {
    const reservations = readFile(RESERVATIONS_FILE);
    return !reservations.some(reservation => 
        reservation.carId === carId &&
        (
            (new Date(startDate) <= new Date(reservation.endDate) && new Date(endDate) >= new Date(reservation.startDate))
        )
    );
};

// Make a reservation
const makeReservation = (req, res) => {
    const { userId, carId, startDate, endDate } = req.body;

    // Fetch car details
    const cars = readFile(CARS_FILE);
    const car = cars.find(car => car.id === carId);

    // Check if the car is available
    if (!car || !isCarAvailable(carId, startDate, endDate)) {
        return res.status(400).json({ message: 'Car not available for the selected dates' });
    }

    // Calculate the total price
    const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = car.PricePerDay * totalDays;

    // Create a new reservation
    const newReservation = {
        id: Date.now(), // unique ID for the reservation
        userId,
        carId,
        startDate,
        endDate,
        totalPrice
    };

    // Save the reservation
    const reservations = readFile(RESERVATIONS_FILE);
    reservations.push(newReservation);
    writeFile(RESERVATIONS_FILE, reservations);

    // Update car availability
    // Only mark as unavailable if it’s fully booked
    // For simplicity, this example doesn't mark cars as unavailable
    // In a real-world scenario, you'd want to adjust availability based on your business rules
    car.availabilityStatus = 'unavailable';
    writeFile(CARS_FILE, cars);

    res.status(201).json({ message: 'Reservation successful', reservation: newReservation });
};

// View reservations
const viewReservations = (req, res) => {
    const { userId } = req.query;

    // Filter reservations by userId if provided
    const reservations = readFile(RESERVATIONS_FILE).filter(reservation => !userId || reservation.userId === userId);

    res.status(200).json(reservations);
};

module.exports = { makeReservation, viewReservations };

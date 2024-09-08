const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000; 
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

// Importing Car-related controllers and multer config
const upload = require('./multerconfig');
const {
    addCar,
    getCars,
    getCarById,
    updateCar,
    uploadCarMedia
} = require('./carController');

// Importing Reservation-related controllers
const { makeReservation, viewReservations } = require('./reservationController');

// Importing User-related controllers
const { registerUser } = require('./register');
const { loginUser } = require('./login');
const { updateUserProfile } = require('./profile');

// Car Management Routes
app.post('/cars', addCar);
app.get('/cars', getCars);
app.get('/cars/:id', getCarById);
app.put('/cars/:id', updateCar);
app.post('/cars/:id/upload', upload.array('media', 10), uploadCarMedia);

// Reservation Routes
app.post('/reservations', makeReservation);
app.get('/reservations', viewReservations);

// User Management Routes
app.post('/register', registerUser);
app.post('/login', loginUser);
app.put('/profile', updateUserProfile);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ` + port);
});

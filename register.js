const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// File to store user data
const USERS_FILE = path.join(__dirname, 'users.json');

// Function to read users from the file
function readUsersFromFile() {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE);
    return JSON.parse(data);
}

// Function to write users to the file
function writeUsersToFile(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Function to register a new user
function registerUser(req, res) {
    const { username, email, password } = req.body;
    const users = readUsersFromFile();

    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: users.length + 1, // Serial ID based on the length of the array
        username,
        email,
        password: hashedPassword
    };
    users.push(newUser);
    writeUsersToFile(users);

    return res.status(201).json({ message: 'User registered successfully.', userId: newUser.id });
}

module.exports = { registerUser };

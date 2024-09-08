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

// Function to update user profile
function updateUserProfile(req, res) {
    const { email, newUsername, newEmail, newPassword } = req.body;
    const users = readUsersFromFile();

    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex === -1) {
        return res.status(400).json({ message: 'User not found.' });
    }

    if (newUsername) users[userIndex].username = newUsername;
    if (newEmail) users[userIndex].email = newEmail;
    if (newPassword) users[userIndex].password = bcrypt.hashSync(newPassword, 10);

    writeUsersToFile(users);

    return res.status(200).json({ message: 'User profile updated successfully.' });
}

module.exports = { updateUserProfile };

const path = require('path');
const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(bodyParser.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/login', (req, res) => {
    const loginFilePath = path.join(__dirname, 'login.html');
    res.sendFile(loginFilePath);
});

app.get('/users.csv', (req, res) => {
    const loginFilePath = path.join(__dirname, 'users.csv');
    res.sendFile(loginFilePath);
});

app.get('/login.html', (req, res) => {
    const loginFilePath = path.join(__dirname, 'login.html');
    res.sendFile(loginFilePath);
});

app.get('/index.html', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath);
});

app.get('/about.html', (req, res) => {
    const filePath = path.join(__dirname, 'about.html');
    res.sendFile(filePath);
});

app.get('/contact.html', (req, res) => {
    const filePath = path.join(__dirname, 'contact.html');
    res.sendFile(filePath);
});

app.get('/event-details.html', (req, res) => {
    const filePath = path.join(__dirname, 'event-details.html');
    res.sendFile(filePath);
});

app.get('/faq.html', (req, res) => {
    const filePath = path.join(__dirname, 'faq.html');
    res.sendFile(filePath);
});

app.get('/gallery.html', (req, res) => {
    const filePath = path.join(__dirname, 'gallery.html');
    res.sendFile(filePath);
});

app.get('/myProfile.html', (req, res) => {
    const filePath = path.join(__dirname, 'myProfile.html');
    res.sendFile(filePath);
});

app.get('/schedule.html', (req, res) => {
    const filePath = path.join(__dirname, 'schedule.html');
    res.sendFile(filePath);
});

app.get('/staff.html', (req, res) => {
    const filePath = path.join(__dirname, 'staff.html');
    res.sendFile(filePath);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usersData = await readUserData();

    const user = usersData.find(
        (user) =>
            user.username === username && bcrypt.compareSync(password, user.password)
    );

    if (user) {
        res.json({ success: true, userData: { name: user.name, surname: user.surname, role: user.role } });
    } else {
        res.json({ success: false });
    }
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password, bankAccount } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const usersData = await readUserData();
    usersData.push({ username, password: hashedPassword, name: firstName, surname: lastName, email: email, bankAccount: bankAccount, role: 'clan' });

    await writeUserData(usersData);

    res.json({ success: true });
});

async function readUserData() {
    const fileContent = await fs.readFile('users.csv', 'utf-8');
    const [headers, ...lines] = fileContent.split('\n').map((line) => line.split(','));

    return lines.map((line) => {
        return headers.reduce((user, header, index) => {
            user[header.trim()] = line[index].trim();
            return user;
        }, {});
    });
}

async function writeUserData(data) {
    const headers = Object.keys(data[0]).join(',');
    const lines = data.map((user) => Object.values(user).join(',')).join('\n');

    await fs.writeFile('users.csv', `${headers}\n${lines}`);
}


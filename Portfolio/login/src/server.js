
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cerp',
  password: 'Jack@15122000',
  port: 5432,
});
const crypto = require('crypto');
const secret = 'jacky'

app.post('/login', async (req, res) => {
    const { username, password } = req.body;  
  
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
      client.release();
      if (user.active === 'false'){
        return res.status(401).json({ error: 'User account is locked.' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const hashedGivenPassword = await bcrypt.hash(password, '$2b$10$DKWzbI9Aa4bkKe1b71kKNu'); // Use the same salt from the stored hash
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        const token = jwt.sign({ username: user.username, role: user.role }, secret, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error fetching user', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
app.get('/api/users', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM users where active = true');
      const users = result.rows;
      client.release();
      res.json(users);
    } catch (err) {
      console.error('Error fetching users', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
app.get('api/userList',async(req,res)=>{
  try{
    const client = await pool.connect();
    const result = await client.query('select * from users');
    const users = result.rows;
    client.release();
    res.json(users)
  }catch(err){
    console.log(`'No Date Found..'`)
  }
});


app.post('/addUser', async (req, res) => {
  const { firstName, lastName, emailId, phoneNo } = req.body;
  console.log(`'request'${firstName}${lastName} ${emailId}${phoneNo}`);
  const hashedDefaultPassword = await bcrypt.hash('Password@123','$2b$10$DKWzbI9Aa4bkKe1b71kKNu' ); // Use the same salt from the stored hash

  try {
    const result = await pool.query('call add_user($1, $2, $3, $4,$5,$6,$7)',
      [firstName, lastName, emailId, phoneNo,emailId,hashedDefaultPassword,'User']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error while creating user:', error.message);
    res.status(500).json({ error: 'Error while creating user: ' + error.message });
  }
});

app.delete('/api/deleteuserAcc/:email', async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  };
  try {
    const deleteUserQuery = 'call delete_user($1)';
    const result = await pool.query(deleteUserQuery, [email]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.message.includes('No user found with email')) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
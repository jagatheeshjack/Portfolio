
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const multer = require('multer');
// const {upload} = multer({ dest: 'uploads/' });
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
const secret = 'jacky';

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
      console.log(hashedGivenPassword);
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
    const result = await client.query('SELECT * FROM users order by user_id');
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
app.put('/api/updateUser', async (req, res) => {
  const { profile } = req.body;
  try {
    const { firstName, lastName,street, city, state, zip,email, phone } = profile;  
    await pool.query(`
      UPDATE users SET
        first_name = $1,
        last_name = $2,
        address_line1 = $4,
        city = $5,
        state = $6,
        postal_code = $7,
        email = $8,
        phone_number = $9
      WHERE username = $10
    `, [firstName, lastName, street, city, state, zip, email, phone, email]);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/addUser', async (req, res) => {
  const { firstName, lastName, emailId, phoneNo } = req.body;
  const hashedDefaultPassword = await bcrypt.hash('Password@123','$2b$10$DKWzbI9Aa4bkKe1b71kKNu' ); // Use the same salt from the stored hash

  try {
    const result = await pool.query('call add_user($1, $2, $3, $4,$5,$6,$7)',
      [firstName, lastName, emailId, phoneNo,emailId,hashedDefaultPassword,'User']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error while creating user: ' + error.message });
  }
});

app.delete('/api/ActivateUser/:email', async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {

    const activateUserQuery = 'CALL Activate_user($1)';
    const result = await pool.query(activateUserQuery, [email]);
    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    console.error('Error activating user:', error);
    if (error.message.includes('No user found with email')) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.delete('/api/deleteuseracc/:email', async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  };  
  try {
    const deleteUserQuery = 'call delete_user($1)';
    const result = await pool.query(deleteUserQuery, [email]);
    res.status(200).json({ message: 'User disabled successfully' });
  } catch (error) {
    console.error('Error Activating user:', error);
    if (error.message.includes('No user found with email')) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.get('/api/Aboutuser', async (req, res) => {
  try {
    const {username} = req.body;
    const client = await pool.connect();
    const result = await client.query('SELECT profile_id, user_id, role, department, "position", date_of_birth, gender, email, phone_number, address_line1, address_line2, city, state, postal_code, country, profile_picture, biography, qualifications, skills, interests, website, linkedin_profile, twitter_handle, facebook_profile, last_updated, created_at, updated_at FROM public.user_profiles where user_id = $1;',[username]);
    const profileinfo = result.rows;
    client.release();
    res.json(profileinfo);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Retrieve user profile by userid
app.get('/api/profile/:userid', (req, res) => {
  const { userid } = req.params;
  console.log(`Received request to get profile for userid: ${userid}`);

  const query = 'SELECT * FROM userprofile WHERE userid = $1';

  db.query(query, [userid], (err, results) => {
    if (err) {
      console.error('Error executing query:', query);
      console.error('Error fetching profile data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Query executed successfully:', results);
    
    if (results.length === 0) {
      console.log(`Profile not found for userid: ${userid}`);
      res.status(404).send('Profile not found');
      return;
    }

    console.log(`Profile found for userid: ${userid}`, results[0]);
    res.json(results[0]);
  });
});

// POST: Update user profile data
app.post('/api/profile/:userid', (req, res) => {
  const { userid }  = req.params;
  const profileData = req.body;

  console.log(`Received request to update profile for userid: ${userid}`);
  console.log('Profile data:', profileData);

  const query = `
    UPDATE userprofile SET
      profileSummary = ?, 
      role = ?, 
      roleDescription = ?, 
      dateOfBirth = ?, 
      age = ?, 
      website = ?, 
      degree = ?, 
      phoneNumber = ?, 
      email = ?, 
      city = ?, 
      freelance = ?, 
      note = ?
    WHERE userid = ?`;

  const values = [
    profileData.profileSummary,
    profileData.role,
    profileData.roleDescription,
    profileData.dateOfBirth,
    profileData.age,
    profileData.website,
    profileData.degree,
    profileData.phoneNumber,
    profileData.email,
    profileData.city,
    profileData.freelance,
    profileData.note,
    userid
  ];

  console.log('Executing query:', query);
  console.log('With values:', values);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error executing update query:', query);
      console.error('Error updating profile data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Update query executed successfully:', results);
    
    if (results.affectedRows === 0) {
      console.log(`No profile found for userid: ${userid} to update`);
      res.status(404).send('Profile not found');
      return;
    }

    console.log(`Profile updated successfully for userid: ${userid}`);
    res.json({ message: 'Profile updated successfully' });
  });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to handle image upload
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    console.log('Received request to upload image.');
    // Check if a file was uploaded
    if (!req.file) {
        console.error('No file received.');
        return res.status(400).json({ success: false, message: 'No file received' });
    }

    const { buffer, originalname } = req.file; // Get the binary data and original name of the file
    const { username } = req.body; 
        
    console.log(`File received: ${originalname}, size: ${buffer.length} bytes`);

    try {''
        // Insert the image buffer into the database
        const result = await pool.query(
            'INSERT INTO portfolios (image_path,username) VALUES ($1,$2) RETURNING username',
            [buffer,username]
        );

        console.log('Image uploaded successfully. Image ID:', result.rows[0].username);
        res.status(201).json({ success: true, student_id: result.rows[0].username });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ success: false, message: 'Error uploading image' });
    }
});

app.get('/api/getimages/:username', async (req, res) => {
  const username = req.params.username;
  console.log('Received request to fetch images for username:', username); // Debugging line

  try {
      const result = await pool.query('SELECT image_path FROM portfolios WHERE username = $1', [username]);
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No images found for this user' });
      }
      const images = result.rows.map(row => ({
        image_path: Buffer.from(row.image_path).toString('base64')
    }));

      res.json(images); // Send the images as a JSON response
  } catch (error) {
      console.error('Error fetching images:', error); // Log the error for debugging
      res.status(500).json({ message: 'Error fetching images' });
  }
});



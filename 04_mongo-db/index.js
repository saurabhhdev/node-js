// Connecting NodeJS with MongoDB | Mongoose + Express

// Schema - Define the structure of the data
// Model - Represents a collection in the database
// Collection - A group of documents in MongoDB
// Using Model, we do CRUD operations on the collection

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

// // Connect to MongoDB

// mongoose
// .connect('mongodb://127.0.0.1:27017/saurabh-db-1')
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.log('Error connecting to MongoDB',err));




// Schema..

// const userSchema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: true,
//     },

//     lastName: {
//         type: String,
//         required: true,
//     },

//     Age: {
//         type: Number,
//         required: true,
//     },

//     email: {
//         type: String,
//         required: true,
//         unique:true,
//     },

//     jobTitle: {
//         type: String,
//         required: true,
//     },
// } , {timestamps:true}
// );

// Model..

// const User = mongoose.model('user',userSchema);


// CRUD Operations...

// // CREATE: Add a new user => POST

// app.post('/users' , async(req,res) => {
//     try{
//         const user = await User.create(req.body);
//         res.status(201).json({message: 'User Created Successfully' , user});
//     } catch(err) {
//         res.status(400).json({ error: err.message});
//     }
// });


// // READ: Fetch all users => GET

// app.get('/users' , async(req,res) => {
//     const users = await User.find();
//     res.status(200).json(users);
// });


// // UPDATE: Update a user by ID => PUT

// app.put('/users/:id', async (req, res) => {
//     try {
//         const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updated) return res.status(404).json({ message: 'User not found' });
//         res.json({ message: 'User updated successfully', user: updated });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });


// // DELETE: Remove user by ID => DELETE
// app.delete('/users/:id', async (req, res) => {
//     const deleted = await User.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'User not found' });
//     res.json({ message: 'User deleted successfully', user: deleted });
//     // res.status(204).send(); // No content to return
// });



app.listen(PORT , () => console.log(`Server started at Port${PORT}`));




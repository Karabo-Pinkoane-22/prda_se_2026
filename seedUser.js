require("dotenv").config(); 
 
const mongoose = require("mongoose"); 
const bcrypt = require("bcryptjs"); 
const User = require("./models/User"); 
 
async function seedUser() { 
    try { 
        await mongoose.connect(process.env.MONGODB_URI); 
 
        const existingUser = await User.findOne({ 
            username: "demo_user" 
        }); 
 
        if (existingUser) { 
            console.log("Demo user already exists."); 
            await mongoose.connection.close(); 
            return; 
        } 
 
        const passwordHash = await bcrypt.hash( 
            "Demo12345!", 
            10 
        ); 
 
        await User.create({ 
            username: "demo_user", 
            password: passwordHash, 
            email: "demo@student.local", 
            phone: "0821234567", 
            dob: new Date("2000-01-15") 
        }); 
 
        console.log("Demo user created successfully."); 
        await mongoose.connection.close(); 
 
    } catch (error) { 
        console.error(error); 
        await mongoose.connection.close(); 
    } 
} 
 
seedUser(); 

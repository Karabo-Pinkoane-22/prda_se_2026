require("dotenv").config(); 
 
const express = require("express"); 
const path = require("path"); 
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const cookieParser = require("cookie-parser"); 
 
const connectDB = require("./config/db"); 
const User = require("./models/User"); 
const authMiddleware = require("./middleware/auth"); 
 
const app = express(); 
const PORT = process.env.PORT || 3000; 
 
// Middleware 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(express.static("public")); 
 
// Connect to MongoDB 
connectDB(); 
 
// Login page 
app.get("/", (req, res) => { 
    res.sendFile( 
        path.join(__dirname, "public", "login.html") 
    ); 
}); 
 
// Login API 
app.post("/api/login", async (req, res) => { 
    try { 
        const { username, password } = req.body; 
 
        if (!username || !password) { 
            return res.status(400).json({ 
                message: "Username and password are required." 
            }); 
        } 
 
        const user = await User.findOne({ username }); 
 
        if (!user) { 
            return res.status(401).json({ 
                message: "Invalid username or password." 
            }); 
        } 
 
        const passwordMatches = await bcrypt.compare( 
            password, 
            user.password 
        ); 
 
        if (!passwordMatches) { 
            return res.status(401).json({ 
                message: "Invalid username or password." 
            }); 
        } 
 
        const token = jwt.sign( 
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } 
        ); 
 
        res.cookie("token", token, { 
            httpOnly: true, 
            sameSite: "lax", 
            secure: process.env.NODE_ENV === "production", 
            maxAge: 60 * 60 * 1000 
        }); 
 
        return res.json({ 
            message: "Login successful." 
        }); 
 
    } catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            message: "Server error." 
        }); 
    } 
}); 
 
// Protected profile page 
app.get("/profile", authMiddleware, (req, res) => { 
    res.sendFile( 
        path.join(__dirname, "public", "profile.html") 
    ); 
}); 
 
// Get logged-in user's profile 
app.get("/api/profile", authMiddleware, async (req, res) => { 
    try { 
        const user = await User.findById(req.userId) 
            .select("-password"); 
 
        if (!user) { 
            return res.status(404).json({ 
                message: "User not found." 
            }); 
        } 
 
        return res.json(user); 
 
    } catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            message: "Server error." 
        }); 
    } 
}); 
 
// Update profile 
app.put("/api/profile", authMiddleware, async (req, res) => { 
    try { 
        const { email, phone, dob } = req.body; 
 
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const phonePattern = /^\d+$/; 
 
        if (!email || !emailPattern.test(email)) { 
            return res.status(400).json({ 
                message: "Please enter a valid email address." 
            }); 
        } 
 
        if (!phone || !phonePattern.test(phone)) { 
            return res.status(400).json({ 
                message: "Phone number must contain digits only." 
            }); 
        } 
 
        if (!dob) { 
            return res.status(400).json({ 
                message: "Date of birth is required." 
            }); 
        } 
 
        const user = await User.findByIdAndUpdate( 
            req.userId, 
            { email, phone, dob }, 
            { new: true, runValidators: true } 
        ).select("-password"); 
 
        return res.json({ 
            message: "Profile updated successfully.", 
            user 
        }); 
 
    } catch (error) { 
        console.error(error); 
        return res.status(500).json({ 
            message: "Server error." 
        }); 
    } 
}); 
 
// Logout 
app.post("/api/logout", (req, res) => { 
    res.clearCookie("token"); 
    return res.json({ 
        message: "Logged out successfully." 
    }); 
}); 
 
// Start server 
app.listen(PORT, () => { 
    console.log( 
        `Application running at http://localhost:${PORT}` 
    ); 
}); 
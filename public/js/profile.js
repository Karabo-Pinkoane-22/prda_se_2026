const profileForm = document.getElementById("profileForm"); 
const message = document.getElementById("message"); 
 
async function loadProfile() { 
    const response = await fetch("/api/profile"); 
 
    if (response.status === 401) { 
        window.location.href = "/"; 
        return; 
    } 
 
    const user = await response.json(); 
 
    document.getElementById("profileTitle").textContent = user.username; 
    document.getElementById("username").value = user.username; 
    document.getElementById("email").value = user.email; 
    document.getElementById("phone").value = user.phone; 
    document.getElementById("dob").value = user.dob 
        ? user.dob.substring(0, 10) 
        : ""; 
} 
 
profileForm.addEventListener("submit", async function (event) { 
    event.preventDefault(); 
 
    const email = document.getElementById("email").value.trim(); 
    const phone = document.getElementById("phone").value.trim(); 
    const dob = document.getElementById("dob").value; 
 
    const response = await fetch("/api/profile", { 
        method: "PUT", 
        headers: { 
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({ email, phone, dob }) 
    }); 
 
    const data = await response.json(); 
 
    message.textContent = data.message; 
    message.hidden = false; 
    message.className = response.ok 
        ? "message success" 
        : "message error"; 
}); 
 
document.getElementById("logoutButton") 
    .addEventListener("click", async function () { 
        await fetch("/api/logout", { 
            method: "POST" 
        }); 
        window.location.href = "/"; 
    }); 
 
loadProfile()
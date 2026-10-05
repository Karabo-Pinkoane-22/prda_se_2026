const loginForm = document.getElementById("loginForm"); 
const message = document.getElementById("message"); 
 
loginForm.addEventListener("submit", async function (event) { 
    event.preventDefault(); 
 
    const username = document 
        .getElementById("username") 
        .value 
        .trim(); 
 
    const password = document 
        .getElementById("password") 
        .value; 
 
    const response = await fetch("/api/login", { 
        method: "POST", 
        headers: { 
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({ username, password }) 
    }); 
 
    const data = await response.json(); 
 
    if (!response.ok) { 
        message.textContent = data.message; 
        message.hidden = false; 
        message.className = "message error"; 
        return; 
    } 
 
    window.location.href = "/profile"; 
}); 
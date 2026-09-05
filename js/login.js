<<<<<<< HEAD
const API_BASE_URL = "https://jabicoconsultancy-2.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            const user = data.user;

            if (!user) {
                alert("User data missing from server");
                return;
            }

            if (user.status !== "active") {
                alert("Your account is still under review");
                return;
            }

            localStorage.setItem("jabico_token", data.token);
            localStorage.setItem("jabico_user", JSON.stringify(user));

            window.location.href = "dashboard.html";

        } catch (err) {
            console.error(err);
            alert("Login failed. Try again.");
        }
    });
=======
const API_BASE_URL = "https://jabicoconsultancy-2.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            const user = data.user;

            if (!user) {
                alert("User data missing from server");
                return;
            }

            if (user.status !== "active") {
                alert("Your account is still under review");
                return;
            }

            localStorage.setItem("jabico_token", data.token);
            localStorage.setItem("jabico_user", JSON.stringify(user));

            window.location.href = "dashboard.html";

        } catch (err) {
            console.error(err);
            alert("Login failed. Try again.");
        }
    });
>>>>>>> 1a078a259e47e30a653cb0996b1260f54ebc05fd
});
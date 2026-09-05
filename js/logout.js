<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("logoutBtn");

    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
=======
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("logoutBtn");

    if (btn) {
        btn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
>>>>>>> 1a078a259e47e30a653cb0996b1260f54ebc05fd
});
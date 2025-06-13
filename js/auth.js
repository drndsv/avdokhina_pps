document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.text();
        alert("Ошибка входа: " + error);
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // сохраняем токен

      // Перенаправление в личный кабинет или на главную
      window.location.href = "profile.html";
    } catch (err) {
      console.error(err);
      alert("Ошибка подключения к серверу");
    }
  });

// Регистрация
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName, email, phone, password }),
          }
        );

        if (!response.ok) {
          const error = await response.text();
          alert("Ошибка регистрации: " + error);
          return;
        }

        alert("Регистрация прошла успешно! Выполните вход.");
        window.location.href = "login.html";
      } catch (err) {
        console.error(err);
        alert("Ошибка подключения к серверу");
      }
    });
  }
});

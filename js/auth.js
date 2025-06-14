// Вход
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const login = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(
          `http://localhost:8080/app_user/isUserExist/${login}/${password}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const error = await response.text();
          alert("Ошибка входа: " + error);
          return;
        }

        const user = await response.json();
        localStorage.setItem("user", JSON.stringify(user)); // сохраняем пользователя

        window.location.href = "profile/home.html";
      } catch (err) {
        console.error(err);
        alert("Ошибка подключения к серверу");
      }
    });
  }

  // Регистрация
  // Регистрация
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:8080/app_user/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName,
            email: email,
            phone: phone,
            password: password,
            roleId: 3,
          }),
        });

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

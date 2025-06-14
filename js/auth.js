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

        // Перенаправление в зависимости от роли
        switch (user.roleId) {
          case 1:
            window.location.href = "profile/home.html";
            break;
          case 2:
            window.location.href = "admin.html";
            break;
          case 3:
            window.location.href = "moderator.html";
            break;
          default:
            alert("Неизвестная роль. Обратитесь к администратору.");
        }
      } catch (err) {
        console.error(err);
        alert("Ошибка подключения к серверу");
      }
    });
  }

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
            roleId: 3, // по умолчанию менеджер
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

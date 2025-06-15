document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  document.getElementById(
    "greeting"
  ).textContent = `Здравствуйте, ${user.fullName}!`;

  document.getElementById("searchBtn").addEventListener("click", () => {
    window.location.href = "../search.html";
  });

  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "../myBookings.html";
  });

  // Обработчик кнопки выхода
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
  });
});

function logout() {
  localStorage.removeItem("user"); // Очистка данных пользователя
  window.location.href = "../login.html"; // Редирект на страницу входа
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  document.getElementById(
    "greeting"
  ).textContent = `Здравствуйте, ${user.fullName}!`;

  document.getElementById("accountBtn").addEventListener("click", () => {
    window.location.href = "account.html";
  });

  document.getElementById("searchBtn").addEventListener("click", () => {
    window.location.href = "../search.html";
  });

  document.getElementById("bookingsBtn").addEventListener("click", () => {
    window.location.href = "bookings.html";
  });
});

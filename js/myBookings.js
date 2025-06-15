document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "../login.html";
    return;
  }

  const tableBody = document.querySelector("#bookingsTable tbody");

  try {
    const response = await fetch(
      `http://localhost:8080/booking/getByUserId/${user.id}`
    );
    if (!response.ok) throw new Error("Ошибка загрузки");

    const bookings = await response.json();

    if (!bookings || bookings.length === 0) {
      tableBody.innerHTML =
        "<tr><td colspan='7'>Бронирования не найдены</td></tr>";
      return;
    }

    bookings.forEach((booking) => {
      // Извлекаем нужные данные
      const userId = booking.appUserId || "Неизвестен"; // ID клиента
      const roomId = booking.roomId || "Неизвестен"; // ID комнаты
      const totalAmount = booking.totalAmount || 0; // Общая стоимость из базы данных

      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${roomId}</td> <!-- ID комнаты -->
            <td>${booking.checkInDate}</td>
            <td>${booking.checkOutDate}</td>
            <td>${totalAmount}₽</td> <!-- Стоимость -->
            <td><button class="btn" onclick="viewBooking(${booking.id})">Открыть</button></td>
          `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML =
      "<tr><td colspan='7'>Ошибка загрузки данных</td></tr>";
  }
});

function viewBooking(id) {
  localStorage.setItem("selectedBookingId", id);
  window.location.href = "bookingDetails.html";
}

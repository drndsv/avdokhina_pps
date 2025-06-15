document.addEventListener("DOMContentLoaded", async () => {
  const bookingId = localStorage.getItem("selectedBookingId");
  if (!bookingId) {
    alert("Бронь не выбрана");
    window.location.href = "myBookings.html";
    return;
  }

  const infoDiv = document.getElementById("bookingInfo");

  try {
    const response = await fetch(`http://localhost:8080/booking/getAll`);
    const bookings = await response.json();
    const booking = bookings.find((b) => b.id == bookingId);

    if (!booking) {
      infoDiv.innerHTML = "<p>Бронь не найдена</p>";
      return;
    }

    // Если объекта room нет — загружаем его вручную
    if (!booking.room && booking.roomId) {
      try {
        const roomResponse = await fetch(
          `http://localhost:8080/room/getById/${booking.roomId}`
        );
        if (roomResponse.ok) {
          booking.room = await roomResponse.json();
        } else {
          console.warn("Не удалось получить данные комнаты");
        }
      } catch (e) {
        console.error("Ошибка загрузки комнаты:", e);
      }
    }

    // Проверяем, есть ли теперь данные комнаты
    const roomNumber = booking.room?.number || `ID: ${booking.roomId}`;

    infoDiv.innerHTML = `
        <p><strong>ID:</strong> ${booking.id}</p>
        <p><strong>Дата заезда:</strong> ${booking.checkInDate}</p>
        <p><strong>Дата выезда:</strong> ${booking.checkOutDate}</p>
        <p><strong>Номер:</strong> ${roomNumber}</p>
      `;

    document.getElementById("cancelBtn").addEventListener("click", async () => {
      const confirmed = confirm("Вы уверены, что хотите отменить бронь?");
      if (!confirmed) return;

      const res = await fetch(
        `http://localhost:8080/booking/delete/${booking.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        alert("Бронь отменена");
        window.location.href = "myBookings.html";
      } else {
        alert("Ошибка при отмене брони");
      }
    });

    document.getElementById("editBtn").addEventListener("click", () => {
      localStorage.setItem("editingBooking", JSON.stringify(booking));
      window.location.href = "editBooking.html";
    });
  } catch (err) {
    console.error(err);
    infoDiv.innerHTML = "<p>Ошибка загрузки информации</p>";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const booking = JSON.parse(localStorage.getItem("editingBooking"));
  if (!booking) {
    alert("Бронь не выбрана");
    window.location.href = "myBookings.html";
    return;
  }

  // Установить текущие значения
  document.getElementById("checkIn").value = booking.checkInDate;
  document.getElementById("checkOut").value = booking.checkOutDate;

  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newCheckIn = document.getElementById("checkIn").value;
    const newCheckOut = document.getElementById("checkOut").value;

    const updatedBooking = {
      id: booking.id,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      appUser: booking.appUser, // требуется для обновления
      room: booking.room, // также обязателен, если используется в сущности
    };

    try {
      const response = await fetch("http://localhost:8080/booking/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBooking),
      });

      if (response.ok) {
        alert("Бронь успешно обновлена");
        localStorage.removeItem("editingBooking");
        window.location.href = "myBookings.html";
      } else {
        alert("Ошибка при обновлении");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка соединения с сервером");
    }
  });
});

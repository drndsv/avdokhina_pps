document.addEventListener("DOMContentLoaded", () => {
  const booking = JSON.parse(localStorage.getItem("editingBooking"));
  if (!booking) {
    alert("Бронь не выбрана");
    window.location.href = "myBookings.html";
    return;
  }

  // Установка текущих значений дат
  document.getElementById("checkIn").value = booking.checkInDate;
  document.getElementById("checkOut").value = booking.checkOutDate;

  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newCheckIn = document.getElementById("checkIn").value;
    const newCheckOut = document.getElementById("checkOut").value;

    // Проверка валидности дат
    const checkInDate = new Date(newCheckIn);
    const checkOutDate = new Date(newCheckOut);
    const days = (checkOutDate - checkInDate) / (1000 * 3600 * 24);

    if (days <= 0) {
      alert("Дата выезда должна быть позже даты заезда");
      return;
    }

    // Пересчёт стоимости
    const pricePerDay = booking.room?.pricePerDay || 0;
    const totalAmount = days * pricePerDay;

    const updatedBooking = {
      id: booking.id,
      checkInDate: newCheckIn,
      checkOutDate: newCheckOut,
      appUserId: booking.appUser?.id || booking.appUserId,
      roomId: booking.room?.id || booking.roomId,
      status: booking.status || "Ожидает подтверждения",
      totalAmount: totalAmount,
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
        alert("Бронирование успешно обновлено");
        localStorage.removeItem("editingBooking");
        window.location.href = "myBookings.html";
      } else {
        const errorData = await response.text();
        console.error("Ошибка сервера:", errorData);
        alert("Ошибка при обновлении");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка соединения с сервером");
    }
  });
});

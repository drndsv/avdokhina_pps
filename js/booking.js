document.addEventListener("DOMContentLoaded", async () => {
  const roomId = localStorage.getItem("selectedRoomId");
  const user = JSON.parse(localStorage.getItem("user")); // получаем пользователя

  if (!roomId || !user) {
    alert("Вы не выбрали номер или не вошли в аккаунт");
    window.location.href = "search.html";
    return;
  }

  let totalAmount = 0;

  try {
    const res = await fetch(`http://localhost:8080/room/getById/${roomId}`);
    if (!res.ok) throw new Error("Ошибка получения данных номера");
    const room = await res.json();

    const roomInfo = document.getElementById("roomInfo");
    roomInfo.innerHTML = `
        <p><strong>Номер ID:</strong> ${room.id}</p>
        <p><strong>Вместимость:</strong> ${room.capacity} гостей</p>
        <p><strong>Цена:</strong> ${room.pricePerDay}₽ / ночь</p>
      `;

    const checkInDate = localStorage.getItem("checkInDate");
    const checkOutDate = localStorage.getItem("checkOutDate");

    console.log("checkInDate:", checkInDate);
    console.log("checkOutDate:", checkOutDate);
    console.log("user:", user);

    if (!checkInDate || !checkOutDate) {
      alert("Ошибка! Даты не были переданы");
      return;
    }

    const checkIn = new Date(checkInDate + "T00:00:00");
    const checkOut = new Date(checkOutDate + "T00:00:00");

    const daysCount = (checkOut - checkIn) / (1000 * 3600 * 24);

    if (daysCount <= 0) {
      alert("Дата выезда должна быть позже даты заезда");
      return;
    }

    totalAmount = room.pricePerDay * daysCount;

    roomInfo.innerHTML += `<p><strong>Итоговая стоимость:</strong> ${totalAmount}₽</p>`;

    // Отображение дат в input (если есть поля)
    document.getElementById("checkInDate").value = checkInDate;
    document.getElementById("checkOutDate").value = checkOutDate;
  } catch (err) {
    console.error(err);
    alert("Не удалось загрузить информацию о номере");
  }

  document
    .getElementById("bookingForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const payment = document.querySelector(
        'input[name="payment"]:checked'
      )?.value;
      const contact = document.getElementById("contactNumber").value;

      if (!payment || !contact) {
        alert("Пожалуйста, заполните все поля");
        return;
      }

      // Безопасное преобразование дат
      const checkInDate = localStorage.getItem("checkInDate");
      const checkOutDate = localStorage.getItem("checkOutDate");

      const checkInDateFormatted = new Date(checkInDate + "T00:00:00")
        .toISOString()
        .split("T")[0];
      const checkOutDateFormatted = new Date(checkOutDate + "T00:00:00")
        .toISOString()
        .split("T")[0];

      const bookingData = {
        appUserId: user.id,
        roomId: +roomId,
        contactNumber: contact,
        paymentMethod: payment,
        checkInDate: checkInDateFormatted,
        checkOutDate: checkOutDateFormatted,
        status: "Ожидает подтверждения",
        totalAmount: totalAmount,
      };

      try {
        const response = await fetch("http://localhost:8080/booking/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Ошибка на сервере:", errorData);
          throw new Error("Ошибка при оформлении брони");
        }

        localStorage.removeItem("selectedRoomId");
        alert("Бронирование успешно оформлено!");
        window.location.href = "booking_success.html";
      } catch (err) {
        console.error(err);
        alert("Ошибка при отправке данных на сервер");
      }
    });
});

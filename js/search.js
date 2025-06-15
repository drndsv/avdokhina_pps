document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("results");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const guests = document.getElementById("guests").value;
    const priceFrom = document.getElementById("priceFrom").value;
    const priceTo = document.getElementById("priceTo").value;

    // Сохраняем даты в localStorage
    localStorage.setItem("checkInDate", checkIn);
    localStorage.setItem("checkOutDate", checkOut);

    // Логируем значения
    console.log("checkInDate:", checkIn);
    console.log("checkOutDate:", checkOut);

    let url;
    let params = new URLSearchParams();
    params.append("checkInDate", checkIn);
    params.append("checkOutDate", checkOut);
    params.append("guestCount", guests);

    // Выбор API в зависимости от указания цен
    if (priceFrom && priceTo) {
      url = `http://localhost:8080/room/findRoomsWithCost`;
      params.append("minPricePerDay", priceFrom);
      params.append("maxPricePerDay", priceTo);
    } else {
      url = `http://localhost:8080/room/findRoomsWithoutCost`;
    }

    try {
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        alert("Ошибка при поиске номеров");
        return;
      }

      const rooms = await response.json();
      showResults(rooms);
    } catch (err) {
      console.error(err);
      alert("Ошибка подключения к серверу");
    }
  });

  function showResults(rooms) {
    resultsContainer.innerHTML = "";

    if (rooms.length === 0) {
      resultsContainer.innerHTML = "<p>Номеров не найдено</p>";
      return;
    }

    rooms.forEach((room) => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        <p><strong>ID:</strong> ${room.id}</p>
        <p><strong>Вместимость:</strong> ${room.capacity} гостей</p>
        <p><strong>Цена:</strong> ${room.pricePerDay}₽ / ночь</p>
        <p><strong>Занят:</strong> ${room.occupied ? "Да" : "Нет"}</p>
        <button onclick="bookRoom(${
          room.id
        })" class="btn">Оформить бронь</button>
      `;
      resultsContainer.appendChild(div);
    });
  }
});

function bookRoom(roomId) {
  localStorage.setItem("selectedRoomId", roomId);
  window.location.href = "booking.html";
}

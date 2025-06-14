document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const resultsContainer = document.getElementById("results");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      checkIn: document.getElementById("checkIn").value,
      checkOut: document.getElementById("checkOut").value,
      guests: document.getElementById("guests").value,
      priceFrom: document.getElementById("priceFrom").value,
      priceTo: document.getElementById("priceTo").value,
    };

    try {
      const response = await fetch("http://localhost:8080/api/rooms/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

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
          <p><strong>Номер:</strong> ${room.number}</p>
          <p><strong>Вместимость:</strong> ${room.capacity} гостей</p>
          <p><strong>Цена:</strong> ${room.price}₽ / ночь</p>
          <button onclick="bookRoom(${room.id})" class="btn">Забронировать</button>
        `;
      resultsContainer.appendChild(div);
    });
  }
});

function bookRoom(roomId) {
  // Можно сохранить данные и перейти на страницу оформления брони
  localStorage.setItem("selectedRoomId", roomId);
  window.location.href = "booking.html";
}

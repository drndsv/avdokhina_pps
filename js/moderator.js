document.addEventListener("DOMContentLoaded", () => {
  loadRooms();

  document.getElementById("roomForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("roomId").value;
    const room = {
      capacity: parseInt(document.getElementById("roomCapacity").value),
      occupied: document.getElementById("roomOccupied").value === "true",
      pricePerDay: parseFloat(document.getElementById("roomPrice").value),
    };

    if (id) room.id = parseInt(id); // Добавляем id в объект при редактировании

    const url = id
      ? "http://localhost:8080/room/update"
      : "http://localhost:8080/room/add";
    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(room),
      });

      if (!res.ok) throw new Error("Ошибка при сохранении номера");

      alert(id ? "Номер обновлен" : "Номер добавлен");
      closeRoomModal();
      loadRooms();
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Не удалось сохранить номер");
    }
  });
});

async function loadRooms() {
  const tableBody = document.querySelector("#roomsTable tbody");
  tableBody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8080/room/getAll");
    const rooms = await res.json();

    rooms.forEach((room) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${room.id}</td>
          <td>${room.capacity}</td>
          <td>${room.occupied ? "Да" : "Нет"}</td>
          <td>${room.pricePerDay} ₽</td>
          <td>
            <button onclick="editRoom(${room.id})">✏️</button>
            <button onclick="deleteRoom(${room.id})">🗑️</button>
          </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Ошибка загрузки номеров:", err);
  }
}

function openRoomModal(isEdit = false, room = null) {
  document.getElementById("roomModal").style.display = "block";
  document.getElementById("roomModalTitle").textContent = isEdit
    ? "Редактировать номер"
    : "Добавить номер";

  document.getElementById("roomId").value = room?.id || "";
  document.getElementById("roomCapacity").value = room?.capacity || "";
  document.getElementById("roomOccupied").value = room?.occupied
    ? "true"
    : "false";
  document.getElementById("roomPrice").value = room?.pricePerDay || "";
}

function closeRoomModal() {
  document.getElementById("roomModal").style.display = "none";
}

async function editRoom(id) {
  try {
    const res = await fetch(`http://localhost:8080/room/getById/${id}`);
    const room = await res.json();
    openRoomModal(true, room);
  } catch (err) {
    alert("Ошибка при загрузке номера");
  }
}

async function deleteRoom(id) {
  if (!confirm("Удалить номер?")) return;
  try {
    await fetch(`http://localhost:8080/room/delete/${id}`, {
      method: "DELETE",
    });
    loadRooms();
  } catch (err) {
    alert("Ошибка удаления номера");
  }
}

// Функция для выхода из системы
function logout() {
  // Логика выхода из системы (например, очистка токена, редирект)
  alert("Вы успешно вышли из системы");
  // Пример редиректа на страницу входа
  window.location.href = "login.html"; // Замените на нужный путь
}

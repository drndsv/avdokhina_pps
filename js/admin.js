function openTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((div) => {
    div.style.display = "none";
  });
  document.getElementById(tabId).style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById(
      "adminName"
    ).textContent = `Здравствуйте, ${user.fullName}`;
  }

  loadUsers();
  loadRules();

  document
    .getElementById("adminRegisterForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const newUser = {
        fullName: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        roleId: parseInt(document.getElementById("role").value, 10),
        isActive: true,
      };

      try {
        const res = await fetch("http://localhost:8080/app_user/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (!res.ok) {
          const errorText = await res.text();
          alert(`Ошибка: ${errorText}`);
          return;
        }

        alert("Пользователь зарегистрирован");
        loadUsers();
      } catch (err) {
        console.error("Ошибка:", err);
        alert("Ошибка при регистрации");
      }
    });

  document.getElementById("ruleForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("ruleId").value;
    const name = document.getElementById("ruleName").value;
    const fileUrl = document.getElementById("ruleFileUrl").value;

    const rule = {
      id: id ? parseInt(id, 10) : undefined,
      regulationName: name,
      fileLink: fileUrl,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/regulation/${id ? "update" : "add"}`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rule),
        }
      );

      if (!res.ok) throw new Error("Ошибка при сохранении");

      alert(id ? "Регламент обновлён" : "Регламент добавлен");
      closeRuleModal();
      loadRules();
    } catch (err) {
      alert("Ошибка при сохранении регламента");
      console.error(err);
    }
  });

  document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editUserId").value;
    const updatedUser = {
      id: Number(document.getElementById("editUserId").value),
      fullName: document.getElementById("editFullName").value,
      phone: document.getElementById("editPhone").value,
      email: document.getElementById("editEmail").value,
      password: document.getElementById("editPassword").value,
      roleId: parseInt(document.getElementById("editRole").value, 10),
      isActive:
        document.getElementById("editIsActive").value === "true" ||
        document.getElementById("editIsActive").value === true,
    };

    console.log(updatedUser); // Проверяем, что данные передаются верно

    try {
      const res = await fetch("http://localhost:8080/app_user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Ошибка при обновлении");

      alert("Пользователь обновлён");
      closeUserModal();
      loadUsers();
    } catch (err) {
      alert("Ошибка при сохранении изменений");
      console.error(err);
    }
  });
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "../login.html";
}

async function loadUsers() {
  const tableBody = document.querySelector("#usersTable tbody");
  tableBody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8080/app_user/getAll");
    if (!res.ok) {
      alert("Ошибка при загрузке пользователей");
      console.error("Ошибка:", res.statusText);
      return;
    }

    const users = await res.json();

    // Фильтруем только администраторов и менеджеров
    const workers = users.filter(
      (user) => user.roleId === 2 || user.roleId === 3
    );

    workers.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.fullName}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>${getRoleName(user.roleId)}</td>
        <td>${user.isActive ? "Активен" : "Заблокирован"}</td>
        <td>
          <button onclick="editUser(${user.id})">✏️</button>
          <button onclick="deleteUser(${user.id})">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Ошибка загрузки пользователей:", err);
  }
}

function getRoleName(roleId) {
  switch (roleId) {
    case 2:
      return "Администратор";
    case 3:
      return "Менеджер";
    default:
      return "Неизвестно";
  }
}

async function editUser(userId) {
  try {
    const res = await fetch(`http://localhost:8080/app_user/getById/${userId}`);
    if (!res.ok) {
      alert("Ошибка при загрузке пользователя");
      return;
    }
    const user = await res.json();
    openUserModal(user);
  } catch (err) {
    alert("Ошибка при загрузке пользователя");
    console.error(err);
  }
}

async function deleteUser(userId) {
  if (!confirm("Удалить пользователя?")) return;
  try {
    const res = await fetch(`http://localhost:8080/app_user/delete/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Ошибка при удалении пользователя");
      return;
    }

    loadUsers();
  } catch (err) {
    alert("Ошибка удаления пользователя");
  }
}

// === Работа с регламентами ===

async function loadRules() {
  const rulesTable = document.querySelector("#rulesTable tbody");
  rulesTable.innerHTML = "";

  try {
    const res = await fetch("http://localhost:8080/regulation/getAll");
    if (!res.ok) {
      alert("Ошибка при загрузке регламентов");
      console.error("Ошибка:", res.statusText);
      return;
    }

    const rules = await res.json();

    rules.forEach((rule) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${rule.id}</td>
          <td>${rule.regulationName}</td>
          <td>${rule.fileLink}</td>
          <td>
            <button onclick="editRule(${rule.id})">✏️</button>
            <button onclick="deleteRule(${rule.id})">🗑️</button>
          </td>
        `;
      rulesTable.appendChild(row);
    });
  } catch (err) {
    console.error("Ошибка загрузки регламентов:", err);
  }
}

function addRule() {
  openRuleModal(false);
}

async function editRule(id) {
  try {
    const res = await fetch(`http://localhost:8080/regulation/getById/${id}`);
    if (!res.ok) {
      alert("Ошибка при получении данных регламента");
      return;
    }

    const rule = await res.json();
    openRuleModal(true, rule);
  } catch (err) {
    alert("Ошибка при получении данных регламента");
    console.error(err);
  }
}

function openRuleModal(isEdit = false, rule = null) {
  document.getElementById("ruleModal").style.display = "block";
  document.getElementById("ruleModalTitle").textContent = isEdit
    ? "Редактировать регламент"
    : "Добавить регламент";

  document.getElementById("ruleId").value = rule?.id || "";
  document.getElementById("ruleName").value = rule?.regulationName || "";
  document.getElementById("ruleFileUrl").value = rule?.fileLink || "";
}

function closeRuleModal() {
  document.getElementById("ruleModal").style.display = "none";
}

function openUserModal(user) {
  document.getElementById("userModal").style.display = "block";
  document.getElementById("editUserId").value = user.id;
  document.getElementById("editFullName").value = user.fullName;
  document.getElementById("editPhone").value = user.phone;
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editPassword").value = user.password;
  document.getElementById("editRole").value = user.roleId;
  document.getElementById("editIsActive").value = user.isActive;
}

function closeUserModal() {
  document.getElementById("userModal").style.display = "none";
}

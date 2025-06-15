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
        roleId: parseInt(document.getElementById("role").value),
        isActive: true,
      };

      try {
        const res = await fetch("http://localhost:8080/app_user/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (!res.ok) {
          alert("Ошибка при регистрации");
          return;
        }

        alert("Пользователь зарегистрирован");
        loadUsers();
      } catch (err) {
        console.error("Ошибка:", err);
      }
    });

  document.getElementById("ruleForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("ruleId").value;
    const name = document.getElementById("ruleName").value;
    const fileUrl = document.getElementById("ruleFileUrl").value;

    const rule = {
      regulationName: name,
      fileLink: fileUrl,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/regulation/${id ? "update/" + id : "add"}`,
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
      fullName: document.getElementById("editFullName").value,
      phone: document.getElementById("editPhone").value,
      email: document.getElementById("editEmail").value,
      password: document.getElementById("editPassword").value,
      roleId: parseInt(document.getElementById("editRole").value),
      isActive: document.getElementById("editIsActive").value === "true",
    };

    try {
      const res = await fetch(`http://localhost:8080/app_user/update/${id}`, {
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
    const users = await res.json();

    users.forEach((user) => {
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
    const res = await fetch(`http://localhost:8080/app_user/get/${userId}`);
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
    await fetch(`http://localhost:8080/app_user/delete/${userId}`, {
      method: "DELETE",
    });
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
    const rules = await res.json();

    rules.forEach((rule) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${rule.id}</td>
          <td>${rule.regulationName}</td>
          <td>${rule.fileLink}"></td>
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
    const res = await fetch(`http://localhost:8080/regulation/get/${id}`);
    const rule = await res.json();
    openRuleModal(true, rule);
  } catch (err) {
    alert("Ошибка при получении данных регламента");
  }
}

async function deleteRule(id) {
  if (!confirm("Удалить регламент?")) return;
  try {
    await fetch(`http://localhost:8080/regulation/delete/${id}`, {
      method: "DELETE",
    });
    loadRules();
  } catch (err) {
    alert("Ошибка при удалении регламента");
  }
}

// === Модальные окна ===

function openRuleModal(isEdit = false, rule = null) {
  document.getElementById("ruleModal").style.display = "block";
  document.getElementById("ruleModalTitle").textContent = isEdit
    ? "Редактировать регламент"
    : "Добавить регламент";
  document.getElementById("ruleId").value = rule?.id || "";
  document.getElementById("ruleName").value = rule?.name || "";
  document.getElementById("ruleFileUrl").value = rule?.fileUrl || "";
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

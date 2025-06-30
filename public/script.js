console.log("✅ script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.padding = "12px 18px";
    toast.style.marginBottom = "10px";
    toast.style.borderRadius = "6px";
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    toast.style.color = "white";
    toast.style.fontSize = "14px";
    toast.style.minWidth = "200px";
    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = "1";
    toast.style.backgroundColor = {
      success: "#4caf50",
      error: "#f44336",
      info: "#2196f3",
      warning: "#ff9800",
    }[type] || "#333";

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  function loadEmployees() {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((employeeNames) => {
        const select = document.getElementById("employeeName");
        if (!select) return;

        select.innerHTML = '<option value="">-- Select an Employee --</option>';
        employeeNames.forEach((emp) => {
          const option = document.createElement("option");
          option.value = emp.id; // using id
          option.textContent = emp.name;
          select.appendChild(option);
        });
      })
      .catch((err) => {
        console.error("Failed to load employee list:", err);
      });
  }

  async function refreshEmployeeList() {
    try {
      const res = await fetch("/api/employees");
      const employees = await res.json();
      const list = document.getElementById("employeeList");
      if (!list) return;

      list.innerHTML = "";

      employees.forEach((emp) => {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.gap = "10px";
        container.style.marginBottom = "8px";

        const input = document.createElement("input");
        input.type = "text";
        input.value = emp.name;
        input.dataset.id = emp.id;
        input.style.flex = "1";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Update";
        saveBtn.className = "save-btn";
        saveBtn.addEventListener("click", async () => {
          const newName = input.value.trim();
          if (!newName) return showToast("Name cannot be empty", "warning");

          try {
            const res = await fetch(`/api/employees/${emp.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: newName }),
            });
            const result = await res.json();
            if (result.success) {
              showToast("Name updated", "success");
              loadEmployees();
            } else {
              showToast(result.error || "Update failed", "error");
            }
          } catch (err) {
            console.error(err);
            showToast("Error updating name", "error");
          }
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Remove";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", async () => {
          const confirmDelete = confirm(`Delete "${emp.name}"?`);
          if (!confirmDelete) return;

          try {
            const res = await fetch(`/api/employees/${emp.id}`, {
              method: "DELETE",
            });
            const result = await res.json();
            if (result.success) {
              showToast(`Removed "${emp.name}"`, "success");
              refreshEmployeeList();
              loadEmployees();
            } else {
              showToast(result.error || "Delete failed", "error");
            }
          } catch (err) {
            console.error(err);
            showToast("Error deleting employee", "error");
          }
        });

        container.appendChild(input);
        container.appendChild(saveBtn);
        container.appendChild(deleteBtn);
        list.appendChild(container);
      });
    } catch (err) {
      console.error("Failed to refresh employee list:", err);
    }
  }

  // Modal logic
  const manageModal = document.getElementById("manageEmployeesModal");
  const openManageBtn = document.getElementById("openManageEmployeesModal");
  const closeManageBtn = document.getElementById("closeManageModal");

  if (openManageBtn && manageModal && closeManageBtn) {
    openManageBtn.addEventListener("click", () => {
      manageModal.style.display = "block";
      refreshEmployeeList(); // <== refresh on open
    });

    closeManageBtn.addEventListener("click", () => {
      manageModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === manageModal) {
        manageModal.style.display = "none";
      }
    });
  }

  // Add employee logic
  const addBtn = document.getElementById("manageAddEmployee");
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      const input = document.getElementById("manageNewEmployeeName");
      const name = input.value.trim();
      if (!name) return showToast("Please enter a name", "warning");

      try {
        const res = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        const data = await res.json();
        if (data.error) return showToast(data.error, "error");

        showToast(`✅ Added ${data.name}`, "success");
        input.value = "";

        await refreshEmployeeList();
        loadEmployees();
      } catch (err) {
        console.error(err);
        showToast("Failed to add employee", "error");
      }
    });
  }

  // Initial population
  loadEmployees();
});

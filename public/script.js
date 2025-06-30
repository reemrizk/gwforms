
console.log("✅ script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.padding = '12px 18px';
    toast.style.marginBottom = '10px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    toast.style.color = 'white';
    toast.style.fontSize = '14px';
    toast.style.minWidth = '200px';
    toast.style.transition = 'opacity 0.5s ease';
    toast.style.opacity = '1';
    toast.style.backgroundColor = {
      success: '#4caf50',
      error: '#f44336',
      info: '#2196f3',
      warning: '#ff9800'
    }[type] || '#333';

    const container = document.getElementById('toast-container');
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  function loadEmployees() {
    fetch('/api/employees')
      .then(res => res.json())
      .then(employeeNames => {
        const select = document.getElementById('employeeName');
        if (!select) return;

        select.innerHTML = '<option value="">-- Select an Employee --</option>';
        employeeNames.forEach(emp => {
          const option = document.createElement('option');
          option.value = emp.name;
          option.textContent = emp.name;
          select.appendChild(option);
        });
      })
      .catch(err => {
        console.error('Failed to load employee list:', err);
      });
  }

  async function refreshEmployeeList() {
  try {
    const res = await fetch('/api/employees');
    const employees = await res.json();
    const list = document.getElementById('employeeList');
    if (!list) return;

    list.innerHTML = '';
    employees.forEach(emp => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.marginBottom = '8px';

      li.innerHTML = `
        <span>${emp.name}</span>
        <button class="delete-btn" data-name="${emp.name}">❌</button>
      `;

      list.appendChild(li);
    });

    // Attach click listeners to delete buttons
    list.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const name = e.target.dataset.name;
        const confirmDelete = confirm(`Delete "${name}"?`);
        if (!confirmDelete) return;

        try {
          const delRes = await fetch(`/api/employees/${encodeURIComponent(name)}`, {
            method: 'DELETE'
          });
          const result = await delRes.json();

          if (result.success) {
            showToast(`🗑️ Deleted ${name}`, 'success');
            await refreshEmployeeList();
            loadEmployees();
          } else {
            showToast(result.error || 'Delete failed', 'error');
          }
        } catch (err) {
          console.error(err);
          showToast('Error deleting employee', 'error');
        }
      });
    });

  } catch (err) {
    console.error('Failed to refresh employee list:', err);
  }
}
  // Manage Employees Modal
  const manageModal = document.getElementById('manageEmployeesModal');
  const openManageBtn = document.getElementById('openManageEmployeesModal');
  const closeManageBtn = document.getElementById('closeManageModal');

  if (openManageBtn && manageModal && closeManageBtn) {
    openManageBtn.addEventListener('click', () => {
      manageModal.style.display = 'block';
    });

    closeManageBtn.addEventListener('click', () => {
      manageModal.style.display = 'none';
    });

    window.addEventListener('click', e => {
      if (e.target === manageModal) {
        manageModal.style.display = 'none';
      }
    });
  }

  const addBtn = document.getElementById('manageAddEmployee');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const input = document.getElementById('manageNewEmployeeName');
      const name = input.value.trim();
      if (!name) return showToast('Please enter a name', 'warning');

      try {
        const res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (data.error) return showToast(data.error, 'error');

        showToast(`✅ Added ${data.name}`, 'success');
        input.value = '';

        await refreshEmployeeList();
        loadEmployees();
      } catch (err) {
        console.error(err);
        showToast('Failed to add employee', 'error');
      }
    });
  }

  // Initial load for dropdown
  loadEmployees();

  
});

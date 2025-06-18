console.log("✅ script.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  // Load employee dropdown
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

  loadEmployees();

  // Manage Employees Modal
  const manageModal = document.getElementById('manageEmployeesModal');
  const openManageBtn = document.getElementById('openManageEmployeesModal');
  const closeManageBtn = document.getElementById('closeManageModal');
  const employeeList = document.getElementById('employeeList');

  if (openManageBtn && manageModal && closeManageBtn) {
    openManageBtn.addEventListener('click', async () => {
      manageModal.style.display = 'block';
      await refreshEmployeeList();
    });

    closeManageBtn.addEventListener('click', () => manageModal.style.display = 'none');
    window.addEventListener('click', e => {
      if (e.target === manageModal) manageModal.style.display = 'none';
    });
  }
let employeeChoices;
async function refreshEmployeeList() {
  try {
    const res = await fetch('/api/employees');
    const employees = await res.json();

    const select = document.getElementById('employeeSelect');
    select.innerHTML = ''; // Clear previous

    employees.forEach(emp => {
      const option = document.createElement('option');
      option.value = emp.name;
      option.textContent = emp.name;
      select.appendChild(option);
    });

    if (employeeChoices) {
      employeeChoices.destroy(); // Clean re-render
    }

    employeeChoices = new Choices(select, {
      removeItemButton: true,
      placeholder: true,
      placeholderValue: 'Search or remove employees…',
      searchPlaceholderValue: 'Type to search...',
    });

    // Handle deletions
    select.addEventListener('removeItem', async function (event) {
      const name = event.detail.value;
      const confirmed = confirm(`Delete "${name}"?`);
      if (!confirmed) {
        refreshEmployeeList();
        return;
      }

      try {
        const delRes = await fetch(`/api/employees/${encodeURIComponent(name)}`, {
          method: 'DELETE',
        });

        const result = await delRes.json();
        if (!result.success) {
          showToast(result.error || 'Failed to delete', 'error');
        } else {
          showToast(`Deleted ${name}`, 'success');
          loadEmployees();
        }
      } catch (err) {
        showToast('Delete failed', 'error');
        console.error(err);
      }
    });

  } catch (err) {
    console.error('Error loading employee list:', err);
    showToast('Failed to load employee list', 'error');
  }
}

  document.getElementById('manageAddEmployee').addEventListener('click', async () => {
    const input = document.getElementById('manageNewEmployeeName');
    const name = input.value.trim();
    if (!name) return alert('Please enter a name');

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      await refreshEmployeeList();
      input.value = '';
      loadEmployees();
    } catch (err) {
      alert('Failed to add employee');
    }
  });

  window.deleteEmployee = async (name) => {
    if (!confirm(`Delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/employees/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      const result = await res.json();

      if (result.success) {
        await refreshEmployeeList();
        loadEmployees();
      } else {
        alert(result.error || 'Delete failed');
      }
    } catch (err) {
      alert('Failed to delete employee');
    }
  };

  // Evaluation Form submission
  const form = document.getElementById('evaluationForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log("📤 Submit button clicked");

      const formData = new FormData(event.target);
      const fields = [
        'dressed', 'direction', 'performed', 'supervision', 'helpfulness',
        'beyond', 'attitude', 'attendance', 'paperwork', 'organize', 'safety'
      ];

      let total = 0;
      let payload = {
        employeeName: formData.get('employeeName')
      };

      fields.forEach(field => {
        const score = parseInt(formData.get(field));
        payload[field] = score;
        total += score;
      });

      payload.total = total;
      payload.grade =
        total >= 40 ? 'A' :
        total >= 35 ? 'B' :
        total >= 29 ? 'C' : 'D';

      console.log("📡 Sending fetch to server", payload);

      try {
        const res = await fetch('/submit-evaluation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert(`✅ Submitted! Score: ${total}, Grade: ${payload.grade}`);
          form.reset();
        } else {
          alert('❌ Submission failed');
        }
      } catch (err) {
        alert('🌐 Network error');
        console.error(err);
      }
    });
  }
});

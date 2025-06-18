
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
      } catch (err) {
        console.error(err);
        showToast('Failed to add employee', 'error');
      }
    });
  }
});

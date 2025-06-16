// Modal DOM references
const openBtn = document.getElementById('openAddEmployeeModal');
const modal = document.getElementById('addEmployeeModal');
const closeBtn = document.getElementById('closeModal');
const submitBtn = document.getElementById('submitNewEmployee');
const nameInput = document.getElementById('newEmployeeName');
const selectDropdown = document.getElementById('employeeName');

// Open modal
openBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal if clicked outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Submit new employee
submitBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();

  if (!name) {
    alert('Please enter a name');
    return;
  }

  try {
    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (data.error) {
      alert('Error: ' + data.error);
    } else {
      const option = document.createElement('option');
      option.value = data.name;
      option.textContent = data.name;
      selectDropdown.appendChild(option);
      selectDropdown.value = data.name;

      nameInput.value = '';
      modal.style.display = 'none';
    }
  } catch (err) {
    console.error(err);
    alert('Failed to add employee');
  }
});

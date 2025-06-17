console.log("script.js loaded");

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

  // Modal toggle logic
  const modal = document.getElementById('addEmployeeModal');
  const openBtn = document.getElementById('openAddEmployeeModal');
  const closeBtn = document.getElementById('closeModal');

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', () => modal.style.display = 'block');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Submit new employee from modal
  const submitNewEmployee = document.getElementById('submitNewEmployee');
  if (submitNewEmployee) {
    submitNewEmployee.addEventListener('click', () => {
      const input = document.getElementById('newEmployeeName');
      const name = input.value.trim();

      if (!name) {
        alert('Please enter a name');
        return;
      }

      fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
          } else {
            loadEmployees(); // Refresh dropdown
            modal.style.display = 'none';
            input.value = '';
          }
        })
        .catch(err => {
          console.error(err);
          alert('Failed to add employee');
        });
    });
  }
});

// Form submission handler
document.getElementById('evaluationForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log(" Submit button clicked");

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
      alert(`Submitted! Score: ${total}, Grade: ${payload.grade}`);
      document.getElementById('evaluationForm').reset();
    } else {
      alert(' Submission failed');
    }
  } catch (err) {
    alert(' Network error');
    console.error(err);
  }
});

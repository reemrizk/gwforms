console.log("✅ script.js loaded");

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
      alert(` Submitted! Score: ${total}, Grade: ${payload.grade}`);
      document.getElementById('evaluationForm').reset();
    } else {
      alert(' Submission failed');
    }
  } catch (err) {
    alert(' Network error');
    console.error(err);
  }
});

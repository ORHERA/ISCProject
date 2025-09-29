async function buildTable() {
  const table = document.getElementById("dynamicTable");
  const counter = document.getElementById("badge");
  const currentUserRole = localStorage.getItem("currentUserRole") || "guest";

  // Ensure we have a tbody
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }
  tbody.innerHTML = ""; // Clear previous rows
  let badge = 0;
  
  // Get CSV file
  try {
    const response = await fetch("Assets/sample.csv");
    if (!response.ok) throw new Error(`Failed to load CSV: ${response.status}`);
    const csvText = await response.text();

    const rows = csvText.trim().split("\n");

    rows.forEach(row => {
      const [policy, issue, asset, severity, recommendation, admin] = row.split(",")
      .map(val => val.trim());


      // Hide admin-only rows for guests
      if (currentUserRole === "guest" && admin === "Y") {
        return;
      }

      const tr = document.createElement("tr");

      // Policy cell (with clickable link)
      const policyCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = `policy.html#${policy}`;
      link.textContent = policy;
      policyCell.appendChild(link);
      tr.appendChild(policyCell);

      // Other visible cells (excluding admin column)
      [issue, asset, severity, recommendation].forEach(val => {
        const td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
      badge++;
    });

    counter.textContent = `${badge}`;
  } catch (err) {
    console.error("Error loading CSV:", err);
    counter.textContent = "Failed to load data.";
  }
}

document.getElementById("va-button").addEventListener("click", buildTable);


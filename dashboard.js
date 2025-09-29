const currentUserRole = "guest"; // or "admin"

async function buildTable() {
  const table = document.getElementById("dynamicTable");
  const counter = document.getElementById("badge");
  table.innerHTML = "";

  let badge = 0;

  // Get CSV file
  try {
    const response = await fetch("sample.csv");
    const csvText = await response.text();

    // Parse CSV
    const rows = csvText.trim().split("\n");

    rows.forEach(row => {
      const [policy, issue, asset, severity, recommendation, admin] = row.split(",");

      // Role-based filtering
      if (currentUserRole === "guest" && admin !== "N") {
        return;
      }

      const tr = document.createElement("tr");

      // Policy ID cell (with link to policy page)
      const policyID = document.createElement("td");
      const link = document.createElement("a");
      link.href = `policies.html#${policy}`;
      link.textContent = policy;
      policy.appendChild(link);
      tr.appendChild(policy);

      // Other cells
      [issue, asset, severity, recommendation, admin].forEach(val => {
        const td = document.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });

      table.appendChild(tr);
      violationCount++;
    });

    counter.textContent = `Total Violations: ${violationCount}`;
  } catch (err) {
    console.error("Error loading CSV:", err);
  }
}

document.getElementById("va button").addEventListener("click", buildTable);
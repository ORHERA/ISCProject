// Press validate button to start
document.getElementById("va-button").addEventListener("click", buildTable);

// buildTable
async function buildTable() {
  const container = document.getElementById("table-container");
  const placeholder = document.getElementById("placeholderTable");

  // Remove placeholder  
  if (placeholder) placeholder.remove();

  // Generate table
  let table = document.getElementById("dynamicTable");
  if (!table) {
    table = document.createElement("table");
    table.id = "dynamicTable";
  table.innerHTML = `
<thead>
  <tr>
    <th style="width:10%">
      <div class="sort-header">
        <span class="header-text">Policy</span>
        <div class="arrows">
          <span class="arrow-up">▲</span>
          <span class="arrow-down">▼</span>
        </div>
      </div>
    </th>
    <th style="width:30%">Issue</th>
    <th style="width:20%">Asset</th>
    <th style="width:13%">
      <div class="sort-header">
        <span class="header-text">Severity</span>
        <div class="arrows">
          <span class="arrow-up">▲</span>
          <span class="arrow-down">▼</span>
        </div>
      </div>
    </th>
    <th style="width:30%">Recommendation</th>
  </tr>
</thead>
`;
    container.appendChild(table);
  }

  //Reset arrows
  table.querySelectorAll(".arrow-up, .arrow-down").forEach(a => a.classList.remove("active"));
  
  // Generate badge
  let badge = document.getElementById("badge");
  if (!badge) {
    badge = document.createElement("badge");
    badge.id = "badge";
    container.appendChild(badge);
  }

  // Save user role to local storage
  const currentUserRole = localStorage.getItem("currentUserRole") || "guest";

  // Generate tbody
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }
  tbody.innerHTML = "";
  
  // Badge init
  let counter = 0;

  // Store data for sorting
  let tableData = [];
  
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

      tableData.push({ policy, issue, asset, severity, recommendation });

      // Badge counter
      counter++;

    });

    // Render table
    renderTable(tableData, tbody);

    // Save table data to local storage
    localStorage.setItem("currentTableData", JSON.stringify(tableData));

    // Update badge
    badge.textContent = `${counter}`;

    // Update severity counts in DOM
    const highEl = document.getElementById("highCount");
    const mediumEl = document.getElementById("mediumCount");
    const lowEl = document.getElementById("lowCount");
    if (highEl) highEl.textContent = highCount;
    if (mediumEl) mediumEl.textContent = mediumCount;
    if (lowEl) lowEl.textContent = lowCount;

    // Enable sorting
    enableSorting(table, tableData, tbody);

  } catch (err) {
    console.error("Error loading CSV:", err);
    counter.textContent = "Failed to load data.";
  }
}

// Render function
function renderTable(data, tbody) {
  tbody.innerHTML = "";
  data.forEach(({ policy, issue, asset, severity, recommendation }) => {
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
  });
}

// Sorting function
function enableSorting(table, tableData, tbody) {
  const headers = table.querySelectorAll("thead th");
  const severityOrder = { "high": 3, "medium": 2, "low": 1 };

  headers.forEach((th, index) => {
    if (index === 0 || index === 3) { // Policy or Severity sortable
      const arrowUp = th.querySelector(".arrow-up");
      const arrowDown = th.querySelector(".arrow-down");

      const key = index === 0 ? "policy" : "severity";

      // Arrow UP click
      arrowUp.addEventListener("click", (e) => {
        e.stopPropagation();

        // Clear active class from all arrows first
        table.querySelectorAll(".arrow-up, .arrow-down").forEach(a => a.classList.remove("active"));

        // Highlight only the clicked arrow
        arrowUp.classList.add("active");

        // Sort data ascending
        tableData.sort((a, b) => {
          if (key === "severity") {
            const valA = severityOrder[a[key].toLowerCase()] || 0;
            const valB = severityOrder[b[key].toLowerCase()] || 0;
            return valA - valB;
          } else {
            const numA = parseInt(a[key].match(/\d+/)?.[0]) || 0;
            const numB = parseInt(b[key].match(/\d+/)?.[0]) || 0;
            return numA - numB;
          }
        });

        renderTable(tableData, tbody);
      });

      // Arrow DOWN click
      arrowDown.addEventListener("click", (e) => {
        e.stopPropagation();

        // Clear active class from all arrows first
        table.querySelectorAll(".arrow-up, .arrow-down").forEach(a => a.classList.remove("active"));

        // Highlight only the clicked arrow
        arrowDown.classList.add("active");

        // Sort data descending
        tableData.sort((a, b) => {
          if (key === "severity") {
            const valA = severityOrder[a[key].toLowerCase()] || 0;
            const valB = severityOrder[b[key].toLowerCase()] || 0;
            return valB - valA;
          } else {
            const numA = parseInt(a[key].match(/\d+/)?.[0]) || 0;
            const numB = parseInt(b[key].match(/\d+/)?.[0]) || 0;
            return numB - numA;
          }
        });

        renderTable(tableData, tbody);
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("table-container");
  const placeholder = document.getElementById("placeholderTable");

  const savedData = localStorage.getItem("currentTableData");
  if (!savedData) return;
  if (placeholder) placeholder.remove();

  let table = document.getElementById("dynamicTable");
  if (!table) {
    table = document.createElement("table");
    table.id = "dynamicTable";
    table.innerHTML = `
      <thead>
        <tr>
          <th style="width:10%">
            <div class="sort-header">
              <span class="header-text">Policy</span>
              <div class="arrows">
                <span class="arrow-up">▲</span>
                <span class="arrow-down">▼</span>
              </div>
            </div>
          </th>
          <th style="width:30%">Issue</th>
          <th style="width:20%">Asset</th>
          <th style="width:13%">
            <div class="sort-header">
              <span class="header-text">Severity</span>
              <div class="arrows">
                <span class="arrow-up">▲</span>
                <span class="arrow-down">▼</span>
              </div>
            </div>
          </th>
          <th style="width:30%">Recommendation</th>
        </tr>
      </thead>
    `;
    container.appendChild(table);
  }

  // Create badge
  let badge = document.getElementById("badge");
  if (!badge) {
    badge = document.createElement("badge");
    badge.id = "badge";
    container.appendChild(badge);
  }

  // Restore table content
  const tbody = table.querySelector("tbody") || document.createElement("tbody");
  table.appendChild(tbody);

  const parsedData = JSON.parse(savedData);
  renderTable(parsedData, tbody);

  // Badge counter
  badge.textContent = parsedData.length; 
  
  // Re-enable sorting
  enableSorting(table, parsedData, tbody);
});

// Clear data on logout
document.getElementById("logout-button")?.addEventListener("click", () => {
  localStorage.removeItem("currentTableData");
  localStorage.removeItem("currentUserRole");
});
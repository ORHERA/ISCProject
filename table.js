const data = [
    { col1: "Row 1, Col 1", col2: "Row 1, Col 2", col3: "Row 1, Col 3", col4: "Row 1, Col 4", col5: "Row 1, Col 5" },
];

function populateTable(tableId, dataArray) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.innerHTML = ''; // Clear existing rows before populating

  dataArray.forEach(rowData => {
    const row = document.createElement('tr');

    // Create and append cells for each piece of data in the row
    for (const key in rowData) {
      const cell = document.createElement('td');
      cell.textContent = rowData[key];
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  });
}

// Call the function to populate the table when the page loads
document.addEventListener('DOMContentLoaded', () => {
  populateTable('dynamicTable', data);
});
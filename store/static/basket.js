function generateReport() {
    const doc = new jspdf.jsPDF(); // Использование объекта jsPDF из глобальной области видимости
    const table = document.querySelector('.table');
    const rows = table.querySelectorAll('tr');

    

    const data = [];
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent.trim());
        });
        data.push(rowData);
    });

    doc.autoTable({
        head: [['Name', 'Price', 'Count', 'Summary']],
        body: data,
    });

    doc.save('Заказ.pdf'); // Сохранение PDF-файла
}
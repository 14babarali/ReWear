import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const AdminReports = () => {
  // Sample Data
  const summaryData = [
    ['Week', 'Orders', 'Users'],
    ['Week 1', 120, 35],
    ['Week 2', 98, 30],
    ['Week 3', 105, 33],
    ['Week 4', 110, 40],
  ];

  const userData = [
    { id: 1, name: 'Sufan Ali', role: 'Buyer' },
    { id: 2, name: 'Sufan Ali', role: 'Seller' },
    { id: 3, name: 'Talha Masood', role: 'Tailor' }
  ];

  const buyerOrdersData = [
    { buyerId: '66e58fd216385a1fd95d3af6', orderId: '66e58fd216385a1fd95d3af6', week: 'Week 1', amount: 2500 },
    { buyerId: '23fy8fd216385a1fd95d3aZ1', orderId: '23fy8fd216385a1fd95d3aZ1', week: 'Week 2', amount: 3500 },
    { buyerId: '82e58fd216385a1fd95d3aF8', orderId: '82e58fd216385a1fd95d3aF8', week: 'Week 1', amount: 2500 },
    { buyerId: '82fy8fd216385a1fd95d3aK3', orderId: '82fy8fd216385a1fd95d3aK3', week: 'Week 2', amount: 3500 },
    { buyerId: '23fy8fd216385a1fd95d3aZ1', orderId: '23fy8fd216385a1fd95d3aZ1', week: 'Week 2', amount: 3500 },
    { buyerId: '94e58fd216385a1fd95d3aY2', orderId: '94e58fd216385a1fd95d3aY2', week: 'Week 3', amount: 1200 },
    { buyerId: '16e58fd216385a1fd95d3aR5', orderId: '94e58fd216385a1fd95d3aY2', week: 'Week 3', amount: 3600 },
    { buyerId: '63e58fd216385a1fd95d3a2', orderId: '94e58fd216385a1fd95d3aY2', week: 'Week 4', amount: 1800 }
  ];

  const generateReport = async () => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const summarySheet = workbook.addWorksheet('Weekly Summary');
    const userListSheet = workbook.addWorksheet('Users List');
    const buyerOrdersSheet = workbook.addWorksheet('Buyer Orders');

    // Adding Data to Sheets
    summarySheet.addRows(summaryData);
    userListSheet.addRows(userData.map(user => [user.id, user.name, user.role]));
    buyerOrdersSheet.addRows(buyerOrdersData.map(order => [order.buyerId, order.orderId, order.week, order.amount]));

    // Styling Headers for Better Visuals
    [summarySheet, userListSheet, buyerOrdersSheet].forEach(sheet => {
      const headerRow = sheet.getRow(1);
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4CAF50' },
          bgColor: { argb: 'FFFFFFFF' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.columns.forEach(column => {
        column.width = 15;
      });
    });

    // Adding Summary Data for Orders and Users
    const totalOrders = summaryData.slice(1).reduce((sum, row) => sum + row[1], 0);
    const totalUsers = summaryData.slice(1).reduce((sum, row) => sum + row[2], 0);

    summarySheet.addRow([]);
    summarySheet.addRow(['Total', totalOrders, totalUsers]);

    const totalRow = summarySheet.getRow(summarySheet.rowCount);
    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC107' },
        bgColor: { argb: 'FFFFFFFF' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Generate and Save Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Admin_Weekly_Report.xlsx');
  };

  return (
    <button
      className='flex bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200'
      onClick={generateReport}
    >
      Generate Report
    </button>
  );
};

export default AdminReports;

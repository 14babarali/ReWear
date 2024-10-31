import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const AdminReports = async () => {
  // Sample Data
  const summaryData = [
    ['Week', 'Orders', 'Users'],
    ['Week 1', 120, 35],
    ['Week 2', 98, 30],
    ['Week 3', 105, 33],
    ['Week 4', 110, 40],
  ];

  const userData = [
    { id: 1, name: 'John Doe', role: 'Buyer' },
    { id: 2, name: 'Jane Smith', role: 'Seller' },
    { id: 3, name: 'Mike Johnson', role: 'Tailor' }
  ];

  const buyerOrdersData = [
    { buyerId: 1, orderId: 101, week: 'Week 1', amount: 250 },
    { buyerId: 1, orderId: 102, week: 'Week 2', amount: 150 }
  ];

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
        fgColor: { argb: 'FF4CAF50' }, // Green header background
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
      column.width = 15; // Adjust column width
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
      fgColor: { argb: 'FFFFC107' }, // Yellow background for totals
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

export default AdminReports;

/* eslint-disable global-require */
/* eslint-disable no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import { google } from 'googleapis';
import qrcode from "./rupmahal.jpg"

function InvoicePdf(props) {
    const { checkArr, setInvoice, invoice } = props
    const route = useLocation()
    const path = route.pathname.indexOf('confirmed') !== -1
   

    const handleInvoice = () => {
        setInvoice(true)
    }

    const handlePrintBtn = () => {
        // Create a new jsPDF instance
        const pdf = new jsPDF(
            {
                orientation: 'portrait',
                unit: 'mm',
                format: [170, 150], // Adjust the format as needed
            }
        );
        const today = new Date()
        checkArr.map((data, ind) => {
            // Add content to the PDF
            pdf.setFontSize(16);
            pdf.text("Rupmahal.com", 8, 8);
            pdf.setFontSize(10);
            pdf.text("Major Jalil Road,", 8, 14,);
            pdf.text("Barishal,Bangladesh", 8, 19,);
            pdf.text("Phone : 01868799857", 8, 24,);

            pdf.addImage(qrcode, 'JPEG', 100, 5, 15, 15); // Replace logoImage with the actual image data
            pdf.setFontSize(10);
            pdf.text(today.toDateString(), 100, 34,);
            pdf.text(`Invoice No : ${data.order_id}`, 100, 41,);

            const { address } = data;
            const lines = pdf.splitTextToSize(address, 100);

            pdf.setFontSize(11);
            pdf.text(`Name : ${data.name}`, 8, 34,);
            pdf.text(`Phone : ${data.phone}`, 8, 41,);
            pdf.text("Address :", 8, 48,);
            lines.forEach((line, index) => {
                pdf.text(line, 27, 48 + index * 5);
            });

            // Add some space
            // pdf.ln(2);
            // Table headers
            const headers = ['Sl', 'Product Name', 'Size', 'Color', 'Price', 'Quantity', 'Total'];
            const dataTb = [
                [1, data.products.slice(0, 70), data.size, data.color, data.price, data.quantity, data.price * data.quantity],
            ];


            pdf.autoTable({
                setFontSize: 8,
                head: [headers],
                body: dataTb,
                startY: 70, // Adjust the starting Y position
                margin: { top: 10 },
            });
            const totalPrice = dataTb.reduce((total, row) => total + row[6], data.delivery_fee);

            pdf.setFontSize(11);
            pdf.text(`Delivery Charge :`, 8, 100,);
            pdf.text(`${data.delivery_fee} tk.`, 45, 100,);
            pdf.text(`Total Price :`, 8, 106,);
            pdf.text(`${totalPrice} tk.`, 45, 106,);
            pdf.text(`Advance :`, 8, 112,);
            pdf.text(`${data.advance} tk.`, 45, 112,);
            pdf.text(`Due :`, 8, 118,);
            pdf.text(`${data.due} tk.`, 45, 118,);
            // Calculate total price

            // Add total price at the bottom
            pdf.text(`Total Due: ${data.due} tk.`, pdf.internal.pageSize.width - 40, pdf.internal.pageSize.height - 20);
            pdf.text('Seller Signature', 10, pdf.internal.pageSize.height - 20);
            // Save the PDF
            ind === (checkArr.length - 1) ? null : pdf.addPage();
        })
        pdf.save(`invoice-${today.toLocaleString()}.pdf`);
    }
// const handlefc = ()=>{
//     const credentials = require('../json/client_secret_327608118936-i6194n0eqkmhqkhmncg1323v8eo1djsc.apps.googleusercontent.com.json');

//         // Create a new JWT client using the credentials
//         const auth = new google.auth.GoogleAuth({
//             credentials,
//             scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//         });

//         // Create a new Sheets instance
//         const sheets = google.sheets({ version: 'v4', auth });

//         // Your JSX array data
//         const jsxArray = [
//             ["Name", "Address", "Phone"],
//             ["John Doe", "123 Main St", "555-1234"],
//             ["Jane Smith", "456 Elm St", "555-5678"],
//             // Add more data as needed
//         ];

//         // ID of your Google Sheet
//         const spreadsheetId = '1DD_01FikC_75QLk8NFDNh4eZ0bMlJ8tIM2rQGaCD1Sc';

//         // The range where you want to insert the data (e.g., Sheet1!A1:C3)
//         const range = `Sheet2!A1:C${  jsxArray.length}`;

//         // Data to be inserted
//         const request = {
//             spreadsheetId,
//             range,
//             valueInputOption: 'RAW',
//             requestBody: {
//                 values: jsxArray,
//             },
//         };

//         // Insert data into the Google Sheet
//         sheets.spreadsheets.values.update(request, (err, response) => {
//             if (err) {
//                 console.error('The API returned an error:', err);
//                 return;
//             }
//             console.log('Data inserted successfully!');
//         });
// }

    return (
        <div>

           {
            path ?
            <div>
                 {  invoice ?
                <button className='btn btn-dark' type='button' onClick={handlePrintBtn}>Print Invoice</button> :
                <button className='btn btn-success' type='button' onClick={handleInvoice}>Select Orders</button>
            }
            </div>
            : null
           }
        </div>
    );
}

export default InvoicePdf;
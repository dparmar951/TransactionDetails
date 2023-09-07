const express = require('express');
const cors = require('cors');
const mockData = require('./data'); // Import mock data

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Define your API routes

// GET /api/transactions route with filters for status and search
app.get('/api/transactions', (req, res) => {
  const { status, search, page } = req.query;

  let filteredData = [...mockData];

  if (status) {
    filteredData = filteredData.filter(
      (transaction) => transaction.status === status
    );
  }

  if (search) {
    filteredData = filteredData.filter((transaction) =>
      transaction.customer.toLowerCase().includes(search.toLowerCase())
    );
  }

  const pageSize = 15;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  res.json(paginatedData);
});

// GET /api/export-transactions route for exporting data to CSV
app.get('/api/export-transactions', (req, res) => {
  const { status, search } = req.query;

  let filteredData = [...mockData];

  if (status) {
    filteredData = filteredData.filter(
      (transaction) => transaction.status === status
    );
  }

  if (search) {
    filteredData = filteredData.filter((transaction) =>
      transaction.customer.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Convert filtered data to CSV format
  const csvData = filteredData
    .map(
      (transaction) =>
        `${transaction.date},${transaction.gross_amount},${transaction.status},${transaction.customer},${transaction.swifter_id},${transaction.external_id},${transaction.source}`
    )
    .join('\n');

  res.header('Content-Type', 'text/csv');
  res.attachment('transactions.csv');
  res.send(csvData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

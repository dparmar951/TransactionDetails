
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const mockData = [
  {
    date: '10-10-2022T13:12:22',
    gross_amount: 1000,
    status: 'initiated',
    customer: 'Eren Akichi',
    swifter_id: '2342WM',
    external_id: 'T234S2',
    source: 'ecommerce',
  },
  {
    date: '10-10-2022T23:12:22',
    gross_amount: 2000,
    status: 'authorized',
    customer: 'Eren Akichi',
    swifter_id: '2342WM',
    external_id: 'T234S2',
    source: 'ecommerce',
  },
  // Add more mock data here
];

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

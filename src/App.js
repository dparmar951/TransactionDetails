

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [statusFilter, searchQuery, currentPage]);

  const fetchData = async () => {
    const url = `/api/transactions?status=${statusFilter}&search=${searchQuery}&page=${currentPage}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExport = async () => {
    const url = `/api/export-transactions?status=${statusFilter}&search=${searchQuery}`;
    try {
      const response = await fetch(url);
      const csvData = await response.text();
      // Create a data URI for downloading the CSV file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="App">
      <h1>Transactions</h1>
      <div>
        <input
          type="text"
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="initiated">Initiated</option>
          <option value="authorized">Authorized</option>
          <option value="successful">Successful</option>
          <option value="returned">Returned</option>
          <option value="canceled">Canceled</option>
          {/* Add other status options here */}
        </select>
      </div>
      <table>
        <thead>
          {/* Table headers here */}
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              {/* Table row data here */}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExport}>Export to CSV</button>
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalItems={transactions.length}
        itemsPerPage={15}
      />
    </div>
  );
}

function Pagination({ currentPage, onPageChange, totalItems, itemsPerPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageClick(currentPage - 1)}>&lt;</button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(index + 1)}
          className={currentPage === index + 1 ? 'active' : ''}
        >
          {index + 1}
        </button>
      ))}
      <button onClick={() => handlePageClick(currentPage + 1)}>&gt;</button>
    </div>
  );
}

export default App;

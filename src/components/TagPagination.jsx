import React from "react";

export default function TagPagination({ totalPages, currentPage, setCurrentPage }) {
  const maxPageDisplay = 5;
  let pages = [];

  if (totalPages <= maxPageDisplay) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pages = [1];

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
  }

  const handlePageChange = (page) => {
    if (page !== "..." && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex items-center justify-center space-x-2 p-4">
      {currentPage > 1 && (
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
      )}

      {pages.map((num, index) => (
        <button
          key={index}
          className={`px-4 py-2 border rounded transition ${
            num === currentPage
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => handlePageChange(num)}
          disabled={num === "..."}
        >
          {num}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className="px-4 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
}

import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange, perPage, onPerPageChange }) => {
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

  return (
    <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
      <div className="flex space-x-2">
        {currentPage > 1 && (
          <button
            className="px-3 py-1 border border-gray-300 rounded"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Prev
          </button>
        )}

        {pages.map((num, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${
              num === currentPage ? "bg-orange-500 text-white" : "bg-white border-gray-300"
            }`}
            onClick={() => num !== "..." && onPageChange(num)}
            disabled={num === "..."}
          >
            {num}
          </button>
        ))}

        <button
          className="px-3 py-1 border border-gray-300 rounded"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* <div className="flex items-center space-x-2">
        {[15, 30, 50].map((size) => (
          <button
            key={size}
            className={`px-3 py-1 border rounded ${
              perPage === size ? "bg-orange-500 text-white" : "bg-white border-gray-300"
            }`}
            onClick={() => onPerPageChange(size)}
          >
            {size}
          </button>
        ))}
        <span className="text-gray-500">per page</span>
      </div> */}
    </div>
  );
};

export default Pagination;

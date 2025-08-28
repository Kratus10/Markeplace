import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5
}) => {
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let page = startPage; page <= endPage; page++) {
      pages.push(page);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 10)}</span> of{' '}
            <span className="font-medium">{totalPages * 10}</span> results
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              className="rounded-l-md"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            
            {/* Page numbers */}
            {pageNumbers.map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'outline'}
                className={`${page === currentPage ? 'z-10 bg-blue-600 text-white' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              className="rounded-r-md"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Next"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

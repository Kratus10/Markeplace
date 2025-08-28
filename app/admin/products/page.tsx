'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  status: string;
  categoryId: string | null;
  category: {
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '', minPrice: '', maxPrice: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Partial<Product> | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    status: 'DRAFT'
  });

  const itemsPerPage = 10;
  
  // Fetch products and categories
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data.products);
        setCategories(result.data.categories);
      } else {
        toast.error(result.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category ? product.categoryId === filters.category : true;
    const matchesStatus = filters.status ? product.status === filters.status : true;
    const matchesMinPrice = filters.minPrice ? product.price >= parseFloat(filters.minPrice) * 100 : true;
    const matchesMaxPrice = filters.maxPrice ? product.price <= parseFloat(filters.maxPrice) * 100 : true;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleEditProduct = (product: Product) => {
    setEditedProduct({ ...product });
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleCreateProduct = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      status: 'DRAFT'
    });
    setIsCreateModalOpen(true);
  };

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/admin/products/export?format=${format}`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-report-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };

  const saveProductChanges = async () => {
    if (!editedProduct || !selectedProduct) return;
    
    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Product updated successfully');
        setIsEditModalOpen(false);
        fetchProducts();
      } else {
        toast.error(result.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const createNewProduct = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Product created successfully');
        setIsCreateModalOpen(false);
        fetchProducts();
      } else {
        toast.error(result.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Product deleted successfully');
        setIsDeleteModalOpen(false);
        fetchProducts();
      } else {
        toast.error(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2 h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <DocumentArrowDownIcon className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button variant="primary" onClick={handleCreateProduct}>
            <PlusIcon className="h-4 w-4 mr-1" /> New Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search Products"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-4 w-4" />}
            />
          </div>
          <div>
            <Select
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(category => ({ value: category.id, label: category.name }))
              ]}
            />
          </div>
          <div>
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'ARCHIVED', label: 'Archived' }
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min Price"
              placeholder="0"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <Input
              label="Max Price"
              placeholder="1000"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded w-10 h-10" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category?.name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${(product.price / 100).toFixed(2)} {product.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                      product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 text-blue-600 hover:text-blue-900"
                      onClick={() => handleEditProduct(product)}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No products found matching your filters</p>
          </div>
        )}
      </Card>

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Product"
      >
        <div className="space-y-4">
          <Input 
            label="Product Name" 
            value={newProduct.name} 
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} 
          />
          <div className="mt-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Price (USD)" 
              type="number"
              value={newProduct.price / 100} 
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) * 100 })} 
            />
            <Select
              label="Category"
              value={newProduct.categoryId}
              onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
              options={[
                { value: '', label: 'Select Category' },
                ...categories.map(category => ({ value: category.id, label: category.name }))
              ]}
            />
          </div>
          <Select
            label="Status"
            value={newProduct.status}
            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
            options={[
              { value: 'DRAFT', label: 'Draft' },
              { value: 'PUBLISHED', label: 'Published' },
              { value: 'ARCHIVED', label: 'Archived' }
            ]}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createNewProduct}>
              Create Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        {selectedProduct && editedProduct && (
          <div className="space-y-4">
            <Input 
              label="Product Name" 
              value={editedProduct.name || ''} 
              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })} 
            />
          <div className="mt-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={editedProduct.description || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
              rows={3}
            />
          </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Price (USD)" 
                type="number"
                value={(editedProduct.price || 0) / 100} 
                onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) * 100 })} 
              />
              <Select
                label="Category"
                value={editedProduct.categoryId || ''}
                onChange={(e) => setEditedProduct({ ...editedProduct, categoryId: e.target.value })}
                options={[
                  { value: '', label: 'Select Category' },
                  ...categories.map(category => ({ value: category.id, label: category.name }))
                ]}
              />
            </div>
            <Select
              label="Status"
              value={editedProduct.status || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, status: e.target.value })}
              options={[
                { value: 'DRAFT', label: 'Draft' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'ARCHIVED', label: 'Archived' }
              ]}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveProductChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Product Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Product Deletion"
      >
        {selectedProduct && (
          <div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the product <span className="font-medium">{selectedProduct.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteProduct}>
                Delete Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagementPage;

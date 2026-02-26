import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import type { Product } from '../services/api';
import type { RootState, AppDispatch } from '../store/store';

const PageContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 24px;
`;

const FiltersCard = styled.div`
  background-color: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  margin-bottom: 24px;
`;

const FiltersRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #E30613;
    border-color: transparent;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  
  p {
    color: #6b7280;
    font-size: 18px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
`;

const ProductImageContainer = styled.div`
  height: 192px;
  background-color: #e5e7eb;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductContent = styled.div`
  padding: 16px;
`;

const ProductCategory = styled.p`
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductPrice = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #E30613;
  margin-bottom: 16px;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ViewDetailsButton = styled(Link)`
  flex: 1;
  background-color: #E30613;
  color: #ffffff;
  text-align: center;
  padding: 8px 0;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #C10510;
  }
`;

const AddToCartButton = styled.button`
  background-color: #E30613;
  color: #ffffff;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #C10510;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProductListingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, categories, loading, error } = useSelector((state: RootState) => state.products);

  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'category' | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Products</PageTitle>

        <FiltersCard>
          <FiltersRow>
            <FilterGroup>
              <Label>Sort by Price</Label>
              <Select value={sortBy} onChange={handleSortChange}>
                <option value="">No sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <Label>Filter by Category</Label>
              <Select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </FilterGroup>
          </FiltersRow>
        </FiltersCard>
      </PageHeader>

      {loading && (
        <LoadingContainer>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </LoadingContainer>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && products.length === 0 && (
        <EmptyState>
          <p>No products found</p>
        </EmptyState>
      )}

      {!loading && !error && displayedProducts.length > 0 && (
        <>
          <ProductsGrid>
            {displayedProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductImageContainer>
                  <ProductImage src={product.image} alt={product.title} />
                </ProductImageContainer>
                <ProductContent>
                  <ProductCategory>{product.category}</ProductCategory>
                  <ProductTitle>{product.title}</ProductTitle>
                  <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                  <ProductActions>
                    <ViewDetailsButton to={`/products/${product.id}`}>
                      View Details
                    </ViewDetailsButton>
                    <AddToCartButton onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </AddToCartButton>
                  </ProductActions>
                </ProductContent>
              </ProductCard>
            ))}
          </ProductsGrid>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <PaginationButton
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default ProductListingPage;

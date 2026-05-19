import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keywordParam = searchParams.get('keyword') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Advanced Filter State
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ minPrice: '', maxPrice: '' });

  let categoryName = 'All Categories';
  let categorySubtitle = 'Explore our highly curated selection of all products.';
  let mappedCategory = '';

  if (keywordParam) {
    categoryName = `Search Results for "${keywordParam}"`;
    categorySubtitle = `Explore our highly curated selection of ${categoryName.toLowerCase()} products.`;
  } else if (categoryId) {
    categoryName = categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    categorySubtitle = 'Showing products matching your search query.';
    // Map the URL category back to the DB category format
    mappedCategory = categoryName; 
  }

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (keywordParam) filters.keyword = keywordParam;
        if (mappedCategory) filters.category = mappedCategory;
        if (appliedFilters.minPrice) filters.minPrice = appliedFilters.minPrice;
        if (appliedFilters.maxPrice) filters.maxPrice = appliedFilters.maxPrice;
        if (sortBy) filters.sortBy = sortBy;

        const data = await fetchProducts(filters);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [mappedCategory, keywordParam, appliedFilters, sortBy]);

  const applyFiltersHandler = () => {
    setAppliedFilters({ minPrice, maxPrice });
  };

  // Group products by category if we are viewing 'All Categories'
  const groupedProducts = useMemo(() => {
    if (categoryId || !products.length) return null;
    
    return products.reduce((acc, product) => {
      const cat = product.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(product);
      return acc;
    }, {});
  }, [products, categoryId]);

  return (
    <div className="category-page animate-fade-in">
      <div className="category-header">
        <div>
          <h1>{categoryName}</h1>
          <p>{categorySubtitle}</p>
        </div>
      </div>

      <div className="category-layout">
        <aside className="filters-sidebar glass-panel" style={{ padding: 'var(--spacing-4)', alignSelf: 'flex-start' }}>
          <h3>Filters & Sorting</h3>
          
          <div className="filter-group" style={{ marginTop: 'var(--spacing-4)' }}>
            <label style={{ fontWeight: 'bold' }}>Sort By</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--bg-color)', color: 'var(--color-text)' }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-group" style={{ marginTop: 'var(--spacing-4)' }}>
            <label style={{ fontWeight: 'bold' }}>Price Range (₹)</label>
            <div className="price-inputs" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ width: '50%', padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--color-text)', border: '1px solid var(--glass-border)' }} />
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ width: '50%', padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--color-text)', border: '1px solid var(--glass-border)' }} />
            </div>
          </div>

          <button onClick={applyFiltersHandler} className="btn btn-primary apply-filters-btn" style={{ width: '100%', marginTop: 'var(--spacing-6)' }}>Apply Filters</button>
        </aside>

        <main className="products-container">
          <div className="products-toolbar">
            <p>Showing {products.length} products</p>
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
          ) : error ? (
             <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</div>
          ) : (
            <>
              {(categoryId || keywordParam) ? (
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="grouped-categories">
                  {groupedProducts && Object.entries(groupedProducts).map(([catName, items]) => (
                    <section key={catName} className="category-section" style={{ marginBottom: '4rem' }}>
                      <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>{catName}</h2>
                        <Link to={`/categories/${catName.toLowerCase().replace(/ /g, '-')}`} className="view-all">View All &rarr;</Link>
                      </div>
                      <div className="products-grid">
                        {items.slice(0, 4).map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;

import { useState, useEffect } from 'react';
import { api, type ItemResponse } from '../lib/api';

const CatalogPage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'book' | 'dvd' | 'magazine' | 'other'>('all');

  useEffect(() => {
    void loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const availableItems = await api.getAvailableItems();
      setItems(availableItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.itemType === filter);

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'book':
        return '#0d47a1';
      case 'dvd':
        return '#7c3aed';
      case 'magazine':
        return '#dc2626';
      default:
        return '#475569';
    }
  };

  const getLoanPeriod = (type: string) => {
    switch (type) {
      case 'book':
        return '3 weeks';
      case 'dvd':
        return '1 week';
      case 'magazine':
        return '2 weeks';
      default:
        return '2 weeks';
    }
  };

  return (
    <section className="card" style={{ maxWidth: '900px' }}>
      <h1>Library Catalog</h1>
      <p className="helper">Browse available items you can check out.</p>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          className={`button ${filter === 'all' ? 'primary' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({items.length})
        </button>
        <button
          className={`button ${filter === 'book' ? 'primary' : ''}`}
          onClick={() => setFilter('book')}
        >
          Books ({items.filter(i => i.itemType === 'book').length})
        </button>
        <button
          className={`button ${filter === 'dvd' ? 'primary' : ''}`}
          onClick={() => setFilter('dvd')}
        >
          DVDs ({items.filter(i => i.itemType === 'dvd').length})
        </button>
        <button
          className={`button ${filter === 'magazine' ? 'primary' : ''}`}
          onClick={() => setFilter('magazine')}
        >
          Magazines ({items.filter(i => i.itemType === 'magazine').length})
        </button>
        <button
          className={`button ${filter === 'other' ? 'primary' : ''}`}
          onClick={() => setFilter('other')}
        >
          Other ({items.filter(i => i.itemType === 'other').length})
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading catalog...</p>
      ) : filteredItems.length > 0 ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' }}>
                    Item ID: {item.id}
                  </div>
                </div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    background: getItemTypeColor(item.itemType),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  {item.itemType.toUpperCase()}
                </div>
              </div>
              <div style={{ 
                padding: '0.75rem',
                background: '#f1f5f9',
                borderRadius: '6px',
                fontSize: '0.875rem',
                color: '#475569'
              }}>
                <div><strong>Loan Period:</strong> {getLoanPeriod(item.itemType)}</div>
                <div><strong>Status:</strong> <span style={{ color: '#047857', fontWeight: 600 }}>Available</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
          <p>No items available in this category.</p>
        </div>
      )}
    </section>
  );
};

export default CatalogPage;


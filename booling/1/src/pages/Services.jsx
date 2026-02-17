import { useState } from 'react'
import { services, categoryLabels } from '../data/services.js'
import { useFilter } from '../hooks/useFilter.js'
import ServiceCard from '../components/ServiceCard.jsx'
import BookingModal from '../components/BookingModal.jsx'
import styles from './Services.module.css'

export default function Services() {
  const { search, setSearch, category, setCategory, sortBy, setSortBy, filtered, categories } = useFilter(services)
  const [modalService, setModalService] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 6

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setCurrentPage(1)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Services</h1>
          <p className={styles.subtitle}>Browse and book workspaces, studios, event venues, and more</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className={styles.searchInput}
            />
          </div>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
            <option value="default">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${category === cat ? styles.catActive : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {paginated.length > 0 ? (
          <div className={styles.grid}>
            {paginated.map((s) => (
              <ServiceCard key={s.id} service={s} onBook={setModalService} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No services found matching your criteria.</p>
            <button className={styles.resetBtn} onClick={() => { setSearch(''); setCategory('all'); setSortBy('default') }}>
              Reset filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${styles.pageNum} ${p === currentPage ? styles.pageNumActive : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <BookingModal
        service={modalService}
        isOpen={!!modalService}
        onClose={() => setModalService(null)}
      />
    </div>
  )
}

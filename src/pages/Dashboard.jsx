import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useBooking } from '../hooks/useBooking.js'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { getUserBookings } = useBooking()
  const bookings = getUserBookings()

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'confirmed')
    const cancelled = bookings.filter((b) => b.status === 'cancelled')
    const totalSpent = confirmed.reduce((sum, b) => sum + b.price, 0)
    return { total: bookings.length, confirmed: confirmed.length, cancelled: cancelled.length, totalSpent }
  }, [bookings])

  const recentBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  }, [bookings])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <h1 className={styles.greeting}>Welcome back, {user.name}</h1>
              <p className={styles.email}>{user.email}</p>
              <span className={styles.role}>{user.role}</span>
            </div>
          </div>
          <button onClick={logout} className={styles.logoutBtn}>Log out</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Bookings</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Confirmed</span>
            <span className={styles.statValue} style={{ color: '#16a34a' }}>{stats.confirmed}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Cancelled</span>
            <span className={styles.statValue} style={{ color: '#dc2626' }}>{stats.cancelled}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Spent</span>
            <span className={styles.statValue}>${stats.totalSpent}</span>
          </div>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Bookings</h2>
          <Link to="/bookings" className={styles.viewAll}>View all</Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className={styles.list}>
            {recentBookings.map((b) => (
              <div key={b.id} className={styles.listItem}>
                <img src={b.serviceImage} alt={b.serviceTitle} className={styles.listImage} />
                <div className={styles.listInfo}>
                  <span className={styles.listTitle}>{b.serviceTitle}</span>
                  <span className={styles.listMeta}>{b.date} at {b.time}</span>
                </div>
                <div className={styles.listRight}>
                  <span className={styles.listPrice}>${b.price}</span>
                  <span className={styles.listStatus} data-status={b.status}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>No bookings yet. Start by browsing our services.</p>
            <Link to="/services" className={styles.emptyBtn}>Browse services</Link>
          </div>
        )}

        <div className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Profile Information</h2>
          <div className={styles.profileGrid}>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>Name</span>
              <span className={styles.profileValue}>{user.name}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>Email</span>
              <span className={styles.profileValue}>{user.email}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>Role</span>
              <span className={styles.profileValue}>{user.role}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>Member since</span>
              <span className={styles.profileValue}>2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

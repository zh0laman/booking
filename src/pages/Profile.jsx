import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useBooking } from '../hooks/useBooking.js'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const { getUserBookings } = useBooking()
  const bookings = getUserBookings()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'confirmed')
    const cancelled = bookings.filter((b) => b.status === 'cancelled')
    const totalSpent = confirmed.reduce((sum, b) => sum + b.price, 0)
    return { total: bookings.length, confirmed: confirmed.length, cancelled: cancelled.length, totalSpent }
  }, [bookings])

  const handleEdit = useCallback(() => {
    setEditing(true)
    setName(user.name)
    setEmail(user.email)
    setErrors({})
    setSaved(false)
  }, [user])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setErrors({})
  }, [])

  const validate = useCallback(() => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (name.trim().length < 2) newErrors.name = 'At least 2 characters'
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format'
    return newErrors
  }, [name, email])

  const handleSave = useCallback((e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) {
      setErrors(v)
      return
    }
    updateProfile({ name: name.trim(), email: email.trim() })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }, [validate, name, email, updateProfile])

  const memberSince = useMemo(() => {
    const users = JSON.parse(localStorage.getItem('sula_users') || '[]')
    const found = users.find((u) => u.id === user?.id)
    if (found?.createdAt) {
      return new Date(found.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    return 'N/A'
  }, [user])

  if (!user) return null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.avatarBlock}>
            <div className={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}>{user.email}</p>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>

          <div className={styles.sidebarStats}>
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatValue}>{stats.total}</span>
              <span className={styles.sidebarStatLabel}>Bookings</span>
            </div>
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatValue}>{stats.confirmed}</span>
              <span className={styles.sidebarStatLabel}>Confirmed</span>
            </div>
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatValue}>${stats.totalSpent}</span>
              <span className={styles.sidebarStatLabel}>Spent</span>
            </div>
          </div>

          <div className={styles.sidebarNav}>
            <Link to="/dashboard" className={styles.sidebarLink}>Dashboard</Link>
            <Link to="/bookings" className={styles.sidebarLink}>My Bookings</Link>
            <Link to="/services" className={styles.sidebarLink}>Browse Services</Link>
          </div>

          <button onClick={logout} className={styles.logoutBtn}>Log out</button>
        </div>

        <div className={styles.main}>
          {saved && (
            <div className={styles.successAlert}>
              Profile updated successfully.
            </div>
          )}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              {!editing && (
                <button onClick={handleEdit} className={styles.editBtn}>Edit</button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>Save Changes</button>
                  <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Full Name</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Role</span>
                  <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Member Since</span>
                  <span className={styles.infoValue}>{memberSince}</span>
                </div>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Booking Summary</h2>
              <Link to="/bookings" className={styles.viewAllLink}>View all</Link>
            </div>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <span className={styles.summaryValue}>{stats.total}</span>
                <span className={styles.summaryLabel}>Total</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryValue} data-type="success">{stats.confirmed}</span>
                <span className={styles.summaryLabel}>Confirmed</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryValue} data-type="error">{stats.cancelled}</span>
                <span className={styles.summaryLabel}>Cancelled</span>
              </div>
              <div className={styles.summaryCard}>
                <span className={styles.summaryValue}>${stats.totalSpent}</span>
                <span className={styles.summaryLabel}>Total Spent</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Account</h2>
            <div className={styles.accountRow}>
              <div className={styles.accountInfo}>
                <span className={styles.accountInfoTitle}>Password</span>
                <span className={styles.accountInfoDesc}>Change your account password</span>
              </div>
              <button className={styles.secondaryBtn} disabled>Change</button>
            </div>
            <div className={styles.accountRow}>
              <div className={styles.accountInfo}>
                <span className={styles.accountInfoTitle}>Notifications</span>
                <span className={styles.accountInfoDesc}>Email notifications for bookings</span>
              </div>
              <button className={styles.secondaryBtn} disabled>Configure</button>
            </div>
            <div className={styles.accountRow} data-danger="true">
              <div className={styles.accountInfo}>
                <span className={styles.accountInfoTitle}>Delete Account</span>
                <span className={styles.accountInfoDesc}>Permanently remove your account and all data</span>
              </div>
              <button className={styles.dangerBtn} disabled>Delete</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

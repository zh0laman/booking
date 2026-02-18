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
    if (!name.trim()) newErrors.name = 'Введите имя'
    if (name.trim().length < 2) newErrors.name = 'Минимум 2 символа'
    if (!email.trim()) newErrors.email = 'Введите email'
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Некорректный формат email'
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
      return new Date(found.createdAt).toLocaleDateString('ru-RU', {
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
              <span className={styles.sidebarStatLabel}>Бронирований</span>
            </div>
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatValue}>{stats.confirmed}</span>
              <span className={styles.sidebarStatLabel}>Подтверждено</span>
            </div>
            <div className={styles.sidebarStat}>
              <span className={styles.sidebarStatValue}>${stats.totalSpent}</span>
              <span className={styles.sidebarStatLabel}>Потрачено</span>
            </div>
          </div>

          <div className={styles.sidebarNav}>
            <Link to="/bookings" className={styles.sidebarLink}>Мои бронирования</Link>
            <Link to="/services" className={styles.sidebarLink}>Смотреть услуги</Link>
          </div>

          <button onClick={logout} className={styles.logoutBtn}>Выйти</button>
        </div>

        <div className={styles.main}>
          {saved && (
            <div className={styles.successAlert}>
              Профиль успешно обновлен.
            </div>
          )}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Личная информация</h2>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Полное имя</label>
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
                  <label htmlFor="email" className={styles.label}>Электронная почта</label>
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
                  <button type="submit" className={styles.saveBtn}>Сохранить</button>
                  <button type="button" onClick={handleCancel} className={styles.cancelBtn}>Отмена</button>
                </div>
              </form>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Полное имя</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Электронная почта</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Роль</span>
                  <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Дата регистрации</span>
                  <span className={styles.infoValue}>{memberSince}</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

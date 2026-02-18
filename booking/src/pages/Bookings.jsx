import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { useBooking } from '../hooks/useBooking.js'
import styles from './Bookings.module.css'

const statusColors = {
  confirmed: '#16a34a',
  cancelled: '#dc2626',
}

export default function Bookings() {
  const { user } = useAuth()
  const { getUserBookings, cancelBooking } = useBooking()
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const userBookings = getUserBookings()

  const filtered = useMemo(() => {
    let result = [...userBookings]
    if (statusFilter !== 'all') {
      result = result.filter((b) => b.status === statusFilter)
    }
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sortBy === 'price') {
      result.sort((a, b) => b.price - a.price)
    }
    return result
  }, [userBookings, statusFilter, sortBy])

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Войдите, чтобы увидеть бронирования</h2>
          <p className={styles.emptyDesc}>Вам необходимо авторизоваться для просмотра бронирований.</p>
          <Link to="/login" className={styles.emptyBtn}>Войти</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Мои бронирования</h1>
          <p className={styles.subtitle}>Всего бронирований: {userBookings.length}</p>
        </div>
      </div>

      <div className={styles.content}>
        {userBookings.length > 0 && (
          <div className={styles.controls}>
            <div className={styles.filters}>
              {['all', 'confirmed', 'cancelled'].map((s) => (
                <button
                  key={s}
                  className={`${styles.filterBtn} ${statusFilter === s ? styles.filterActive : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {{ all: 'Все', confirmed: 'Подтверждённые', cancelled: 'Отменённые' }[s]}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="price">По убыванию цены</option>
            </select>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <img src={booking.serviceImage} alt={booking.serviceTitle} className={styles.bookingImage} />
                <div className={styles.bookingInfo}>
                  <div className={styles.bookingTop}>
                    <h3 className={styles.bookingTitle}>{booking.serviceTitle}</h3>
                    <span className={styles.status} style={{ color: statusColors[booking.status], background: `${statusColors[booking.status]}12` }}>
                      {booking.status === 'confirmed' ? 'Подтверждено' : 'Отменено'}
                    </span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <span>{booking.date}</span>
                    <span className={styles.dot} />
                    <span>{booking.time}</span>
                    <span className={styles.dot} />
                    <span>{booking.guests} {'гост' + (booking.guests === 1 ? 'ь' : booking.guests < 5 ? 'я' : 'ей')}</span>
                  </div>
                  <div className={styles.bookingFooter}>
                    <span className={styles.bookingPrice}>${booking.price}</span>
                    {booking.status === 'confirmed' && (
                      <button className={styles.cancelBtn} onClick={() => cancelBooking(booking.id)}>
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Пока нет бронирований</h2>
            <p className={styles.emptyDesc}>Просмотрите наши услуги и сделайте первое бронирование.</p>
            <Link to="/services" className={styles.emptyBtn}>Смотреть услуги</Link>
          </div>
        )}
      </div>
    </div>
  )
}

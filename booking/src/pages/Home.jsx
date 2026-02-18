import { useState } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services.js'
import ServiceCard from '../components/ServiceCard.jsx'
import BookingModal from '../components/BookingModal.jsx'
import styles from './Home.module.css'

const stats = [
  { value: '2 400+', label: 'Бронирований выполнено' },
  { value: '150+', label: 'Активных площадок' },
  { value: '4.9', label: 'Средний рейтинг' },
  { value: '99.8%', label: 'Время работы' },
]

const steps = [
  { num: '01', title: 'Выбирайте', desc: 'Изучите наш каталог рабочих пространств, студий и площадок для мероприятий.' },
  { num: '02', title: 'Бронируйте', desc: 'Выберите дату и время, укажите предпочтения, получите мгновенное подтверждение.' },
  { num: '03', title: 'Оплачивайте', desc: 'Безопасная оплата с прозрачными ценами. Никаких скрытых комиссий.' },
]

export default function Home() {
  const [modalService, setModalService] = useState(null)
  const featured = services.slice(0, 3)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Платформа онлайн-бронирования</span>
            <h1 className={styles.heroTitle}>
              Бронируйте пространства.<br />Воплощайте идеи.
            </h1>
            <p className={styles.heroDesc}>
              Современная платформа для бронирования рабочих пространств, творческих студий, площадок для мероприятий и велнес-залов. Мгновенное подтверждение, прозрачные цены.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/services" className={styles.ctaPrimary}>Смотреть услуги</Link>
              <Link to="/register" className={styles.ctaSecondary}>Создать аккаунт</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&h=480&fit=crop"
              alt="Интерьер современного рабочего пространства"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsInner}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <BookingModal
        service={modalService}
        isOpen={!!modalService}
        onClose={() => setModalService(null)}
      />
    </div>
  )
}

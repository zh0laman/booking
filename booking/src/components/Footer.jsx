import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>S</span>
              <span className={styles.logoText}>Sula</span>
            </div>
            <p className={styles.tagline}>
              Современная платформа бронирования рабочих пространств, мероприятий и творческих услуг.
            </p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Платформа</h4>
            <Link to="/services" className={styles.footerLink}>Услуги</Link>
            <Link to="/bookings" className={styles.footerLink}>Бронирования</Link>
            <Link to="/dashboard" className={styles.footerLink}>Панель управления</Link>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Компания</h4>
            <span className={styles.footerLink}>О нас</span>
            <span className={styles.footerLink}>Карьера</span>
            <span className={styles.footerLink}>Контакты</span>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Правовая информация</h4>
            <span className={styles.footerLink}>Конфиденциальность</span>
            <span className={styles.footerLink}>Условия</span>
            <span className={styles.footerLink}>Безопасность</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>2026 Sula Booking. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

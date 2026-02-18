import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import styles from './Auth.module.css'

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  if (user) {
    navigate('..', { replace: true })
    return null
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Введите имя'
    if (!form.email.trim()) errs.email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Введите корректный email'
    if (!form.password) errs.password = 'Введите пароль'
    else if (form.password.length < 6) errs.password = 'Пароль должен содержать минимум 6 символов'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Пароли не совпадают'
    return errs
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const result = register(form.name, form.email, form.password)
    if (result.success) {
      navigate('..')
    } else {
      setServerError(result.error)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>Создать аккаунт</h1>
          <p className={styles.cardDesc}>Начните бронировать пространства за секунды</p>
        </div>

        {serverError && <div className={styles.alert}>{serverError}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Полное имя</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="Иван Иванов"
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Электронная почта</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="ivan@example.com"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="Мин. 6 символов"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className={styles.submitBtn}>Создать аккаунт</button>
        </form>

        <p className={styles.switchText}>
          Уже есть аккаунт? <Link to="/login" className={styles.switchLink}>Войти</Link>
        </p>
      </div>
    </div>
  )
}

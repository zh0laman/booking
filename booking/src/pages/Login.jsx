import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import styles from './Auth.module.css'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  if (user) {
    navigate('..', { replace: true })
    return null
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Введите email'
    if (!form.password) errs.password = 'Введите пароль'
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
    const result = login(form.email, form.password)
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
          <h1 className={styles.cardTitle}>С возвращением</h1>
          <p className={styles.cardDesc}>Войдите в свой аккаунт</p>
        </div>

        {serverError && <div className={styles.alert}>{serverError}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Электронная почта</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="user@example.com"
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
              placeholder="Введите пароль"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.submitBtn}>Войти</button>
        </form>

        <p className={styles.switchText}>
          {"Нет аккаунта? "}<Link to="/register" className={styles.switchLink}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

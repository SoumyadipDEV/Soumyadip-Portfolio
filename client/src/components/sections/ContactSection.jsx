import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiTwitter,
} from 'react-icons/fi'

import { sendContactMessage } from '../../api/contactAPI'
import { getPersonalInfo } from '../../api/personalInfoAPI'
import Button from '../common/Button'
import Card from '../common/Card'
import EmptyState from '../common/EmptyState'
import SkeletonCard from '../common/SkeletonCard'
import SectionShell from './SectionShell'

const initialFormState = {
  sender_name: '',
  sender_email: '',
  subject: '',
  message: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldClassName =
  'w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-gold disabled:cursor-not-allowed disabled:opacity-70 dark:border-navy-lighter dark:bg-navy dark:text-gray-100'

function validateForm(formData) {
  const nextErrors = {}

  if (!formData.sender_name.trim()) {
    nextErrors.sender_name = 'Name is required'
  }

  if (!formData.sender_email.trim()) {
    nextErrors.sender_email = 'Email is required'
  } else if (!emailPattern.test(formData.sender_email.trim())) {
    nextErrors.sender_email = 'Enter a valid email address'
  }

  if (!formData.message.trim()) {
    nextErrors.message = 'Message is required'
  }

  return nextErrors
}

function FieldError({ message }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs font-medium text-red-500">{message}</p>
}

function ContactSection() {
  const [personalInfo, setPersonalInfo] = useState(null)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [infoError, setInfoError] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    getPersonalInfo()
      .then((data) => {
        if (isMounted) {
          setPersonalInfo(data)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setInfoError(requestError)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingInfo(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const contactItems = useMemo(
    () =>
      [
        { href: personalInfo?.email ? `mailto:${personalInfo.email}` : '', icon: FiMail, label: 'Email', value: personalInfo?.email },
        { href: personalInfo?.phone ? `tel:${personalInfo.phone}` : '', icon: FiPhone, label: 'Phone', value: personalInfo?.phone },
        { href: '', icon: FiMapPin, label: 'Location', value: personalInfo?.location },
      ].filter((item) => item.value),
    [personalInfo],
  )

  const socialLinks = useMemo(
    () =>
      [
        { href: personalInfo?.github_url, icon: FiGithub, label: 'GitHub' },
        { href: personalInfo?.linkedin_url, icon: FiLinkedin, label: 'LinkedIn' },
        { href: personalInfo?.twitter_url, icon: FiTwitter, label: 'Twitter' },
      ].filter((link) => link.href),
    [personalInfo],
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateForm(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length) {
      toast.error('Fix the highlighted fields.')
      return
    }

    setSubmitting(true)

    try {
      await sendContactMessage({
        sender_name: formData.sender_name.trim(),
        sender_email: formData.sender_email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      })

      toast.success('Message sent successfully')
      setFormData(initialFormState)
      setErrors({})
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Message could not be sent')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SectionShell badge="Contact" id="contact" title="Start a conversation" tone="alt">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          {loadingInfo ? (
            <SkeletonCard className="min-h-80" />
          ) : infoError ? (
            <EmptyState
              message="Contact details are temporarily unavailable."
              title="Unable to load contact info"
            />
          ) : (
            <Card className="h-full">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Contact info
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
                Send a message through the form or use the published contact details.
              </p>

              {contactItems.length ? (
                <div className="mt-6 grid gap-4">
                  {contactItems.map(({ href, icon: Icon, label, value }) => {
                    const content = (
                      <>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                          <Icon aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                            {label}
                          </span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {value}
                          </span>
                        </span>
                      </>
                    )

                    return href ? (
                      <a className="flex items-center gap-3" href={href} key={label}>
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3" key={label}>
                        {content}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  Contact details are not published yet.
                </p>
              )}

              {socialLinks.length ? (
                <div className="mt-8 flex gap-3">
                  {socialLinks.map(({ href, icon: Icon, label }) => (
                    <a
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold text-gold transition hover:bg-gold hover:text-navy"
                      href={href}
                      key={label}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </Card>
          )}
        </div>

        <Card>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <fieldset className="grid gap-4" disabled={submitting}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Name
                  <input
                    className={fieldClassName}
                    name="sender_name"
                    onChange={handleChange}
                    placeholder="Your name"
                    type="text"
                    value={formData.sender_name}
                  />
                  <FieldError message={errors.sender_name} />
                </label>

                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                  Email
                  <input
                    className={fieldClassName}
                    name="sender_email"
                    onChange={handleChange}
                    placeholder="you@example.com"
                    type="email"
                    value={formData.sender_email}
                  />
                  <FieldError message={errors.sender_email} />
                </label>
              </div>

              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                Subject
                <input
                  className={fieldClassName}
                  name="subject"
                  onChange={handleChange}
                  placeholder="Optional subject"
                  type="text"
                  value={formData.subject}
                />
              </label>

              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                Message
                <textarea
                  className={`${fieldClassName} min-h-36 resize-y`}
                  name="message"
                  onChange={handleChange}
                  placeholder="Write your message"
                  value={formData.message}
                />
                <FieldError message={errors.message} />
              </label>
            </fieldset>

            <Button className="justify-self-start" disabled={submitting} type="submit">
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy border-t-transparent" />
              ) : (
                <FiSend aria-hidden="true" />
              )}
              {submitting ? 'Sending Message' : 'Send Message'}
            </Button>
          </form>
        </Card>
      </div>
    </SectionShell>
  )
}

export default ContactSection

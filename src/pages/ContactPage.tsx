import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, CircleCheck, Send } from 'lucide-react'

import { contact } from '@/data/company'
import { firstError, emailError, requiredError, minLengthError, isClean, type FieldErrors } from '@/lib/validation'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/Section'

const FORM_ID = 'contact-form'

type ContactFields = 'name' | 'email' | 'company' | 'projectType' | 'projectDetails'

type ContactState = Record<ContactFields, string>

const INITIAL_STATE: ContactState = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  projectDetails: '',
}

export function ContactPage() {
  const [values, setValues] = useState<ContactState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FieldErrors<ContactFields>>({})
  const [touched, setTouched] = useState<Record<ContactFields, boolean>>({
    name: false,
    email: false,
    company: false,
    projectType: false,
    projectDetails: false,
  })
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'submitted') return
    const container = document.getElementById(FORM_ID)
    container?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [status])

  const validateField = (field: ContactFields, value: string): string | undefined => {
    switch (field) {
      case 'name':
        return firstError(requiredError(value, 'Name'), minLengthError(value, 2, 'Name'))
      case 'email':
        return emailError(value)
      case 'company':
        return undefined // optional
      case 'projectType':
        return requiredError(value, 'Project type')
      case 'projectDetails':
        return firstError(requiredError(value, 'Project details'), minLengthError(value, 14, 'Project details'))
      default:
        return undefined
    }
  }

  const runValidation = (state: ContactState = values): FieldErrors<ContactFields> => {
    const next: FieldErrors<ContactFields> = {}
    ;(Object.keys(state) as ContactFields[]).forEach((field) => {
      const error = validateField(field, state[field])
      if (error) next[field] = error
    })
    return next
  }

  const handleChange = (field: ContactFields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const nextValue = event.target.value
    setValues((prev) => {
      const next = { ...prev, [field]: nextValue }
      if (touched[field]) {
        setErrors(runValidation(next))
      }
      return next
    })
  }

  const handleBlur = (field: ContactFields) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, values[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ name: true, email: true, company: true, projectType: true, projectDetails: true })
    const validation = runValidation()
    setErrors(validation)

    if (!isClean(validation)) {
      setStatus('idle')
      setServerMessage(null)
      return
    }

    setStatus('submitted')
    setServerMessage(
      'This is a demonstration form. Devora has not configured an email or submission service for this project — nothing has been sent.',
    )
  }

  return (
    <section className="relative pb-24 pt-6 sm:pb-32 sm:pt-10 lg:pt-14">
      <div className="shell-narrow">
        <SectionHeading
          eyebrow="Contact"
          title={contact.heading}
          lead={contact.description}
          align="center"
          as="h1"
        />

        <Reveal y={24} className="mt-14">
          <div className="panel panel-hover overflow-hidden">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <span className="t-mono text-dusk">Inquiry Form</span>
                <h2 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] tracking-tight text-frost">
                  Tell us about your project
                </h2>
                <p className="t-body mt-4 text-mist/85">
                  Provide a few details about your current website or your idea. We will reply via email once a real channel is configured — for this academic build, the form remains a demonstration.
                </p>
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-ice" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-ash">
                    No business address, phone number, email address or social media accounts have been invented for Devora. Please use this form only.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
                {status === 'submitted' && serverMessage ? (
                  <div className="mb-6 flex gap-3 rounded-2xl border border-ice/40 bg-ice/10 p-4" role="status" aria-live="polite">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-ice" aria-hidden="true" />
                    <p className="text-sm text-mist/90">{serverMessage}</p>
                  </div>
                ) : null}

                <form id={FORM_ID} noValidate className="grid gap-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="field-label" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      className="field-input"
                      value={values.name}
                      onChange={handleChange('name')}
                      onBlur={handleBlur('name')}
                      aria-invalid={Boolean(errors.name)}
                      autoComplete="name"
                    />
                    {errors.name ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className="field-input"
                      value={values.email}
                      onChange={handleChange('email')}
                      onBlur={handleBlur('email')}
                      aria-invalid={Boolean(errors.email)}
                      autoComplete="email"
                    />
                    {errors.email ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-company">
                      Company or Business Name (optional)
                    </label>
                    <input
                      id="contact-company"
                      className="field-input"
                      value={values.company}
                      onChange={handleChange('company')}
                      onBlur={handleBlur('company')}
                      aria-invalid={Boolean(errors.company)}
                      autoComplete="organization"
                    />
                    {errors.company ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.company}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-project-type">
                      Project Type
                    </label>
                    <select
                      id="contact-project-type"
                      className="field-input"
                      value={values.projectType}
                      onChange={handleChange('projectType')}
                      onBlur={handleBlur('projectType')}
                      aria-invalid={Boolean(errors.projectType)}
                    >
                      <option value="">Select an option</option>
                      <option value="Website Modernization & Redesign">Website Modernization & Redesign</option>
                      <option value="New Website Build">New Website Build</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Frontend/Backend Enhancement">Frontend/Backend Enhancement</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.projectType ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.projectType}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="contact-details">
                      Project Details
                    </label>
                    <textarea
                      id="contact-details"
                      className="field-input min-h-[150px] resize-y"
                      value={values.projectDetails}
                      onChange={handleChange('projectDetails')}
                      onBlur={handleBlur('projectDetails')}
                      aria-invalid={Boolean(errors.projectDetails)}
                      placeholder="Share your goals, current site (if any), and what you'd like to change."
                    />
                    {errors.projectDetails ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.projectDetails}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-dusk">
                      Required fields validated on the client. No data is transmitted.
                    </p>
                    <Button type="submit" size="lg" icon={Send}>
                      Send Inquiry
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

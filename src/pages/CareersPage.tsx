import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, CircleCheck, Send } from 'lucide-react'

import jobPoster from '@assets/devorapubmat1-opt.jpg'
import { careers, identity } from '@/data/company'
import { applicationPositions, vacancy } from '@/data/jobs'
import { emailError, firstError, isClean, minLengthError, requiredError, urlError, type FieldErrors } from '@/lib/validation'
import { Button } from '@/components/ui/Button'
import { Lightbox } from '@/components/ui/Lightbox'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/Section'

const FORM_ID = 'application-form'

type ApplicationFields = 'fullName' | 'email' | 'position' | 'portfolio' | 'introduction'

type ApplicationState = Record<ApplicationFields, string>

const INITIAL_STATE: ApplicationState = {
  fullName: '',
  email: '',
  position: vacancy.position,
  portfolio: '',
  introduction: '',
}

export function CareersPage() {
  const [values, setValues] = useState<ApplicationState>(INITIAL_STATE)
  const [errors, setErrors] = useState<FieldErrors<ApplicationFields>>({})
  const [touched, setTouched] = useState<Record<ApplicationFields, boolean>>({
    fullName: false,
    email: false,
    position: false,
    portfolio: false,
    introduction: false,
  })
  const [status, setStatus] = useState<'idle' | 'validating' | 'submitted'>('idle')
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'submitted') return
    const container = document.getElementById(FORM_ID)
    container?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [status])

  const validateField = (field: ApplicationFields, value: string): string | undefined => {
    switch (field) {
      case 'fullName':
        return firstError(requiredError(value, 'Full name'), minLengthError(value, 2, 'Full name'))
      case 'email':
        return emailError(value)
      case 'position':
        return requiredError(value, 'Position')
      case 'portfolio':
        return urlError(value)
      case 'introduction':
        return firstError(requiredError(value, 'Short introduction'), minLengthError(value, 12, 'Short introduction'))
      default:
        return undefined
    }
  }

  const runValidation = (state: ApplicationState = values): FieldErrors<ApplicationFields> => {
    const next: FieldErrors<ApplicationFields> = {}
    ;(Object.keys(state) as ApplicationFields[]).forEach((field) => {
      const error = validateField(field, state[field])
      if (error) next[field] = error
    })
    return next
  }

  const handleChange = (field: ApplicationFields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const nextValue = event.target.value
    setValues((prev) => {
      const next = { ...prev, [field]: nextValue }
      if (touched[field]) {
        setErrors(runValidation(next))
      }
      return next
    })
  }

  const handleBlur = (field: ApplicationFields) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, values[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ fullName: true, email: true, position: true, portfolio: true, introduction: true })
    const validation = runValidation()
    setErrors(validation)

    if (!isClean(validation)) {
      setStatus('idle')
      setServerMessage(null)
      return
    }

    setStatus('submitted')
    setServerMessage(
      'This is a demonstration form. No application has been sent or stored. The vacancy is listed as a sample for the academic company website.',
    )
  }

  const isSubmitting = status === 'validating'

  return (
    <section className="relative pb-24 pt-6 sm:pb-32 sm:pt-10 lg:pt-14">
      <div className="shell-narrow">
        <SectionHeading
          eyebrow="Careers & Job Vacancy"
          title={careers.heading}
          lead={careers.intro}
          align="center"
          as="h1"
        />

        <Reveal y={24} className="mt-14">
          <div className="panel panel-hover overflow-hidden">
            {/* Poster + posting header */}
            <div className="grid gap-8 border-b border-white/10 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:p-10">
              <figure className="mx-auto w-full max-w-[20rem]">
                <Lightbox
                  src={jobPoster}
                  alt={`Sample job posting poster for the ${vacancy.position} vacancy at Devora.`}
                  openLabel={`Enlarge the sample job posting poster for the ${vacancy.position} vacancy`}
                  title={`${vacancy.position} job posting poster`}
                  caption="Sample job posting material for the vacancy described here."
                  width={1200}
                  height={1500}
                  className="shadow-[0_34px_90px_-46px_rgba(224,66,124,0.75)]"
                  imageClassName="w-full rounded-2xl border border-white/10"
                />
                <figcaption className="mt-3 text-center text-xs text-dusk">
                  Sample job posting material for the vacancy described here.
                </figcaption>
              </figure>

              <div>
                <span className="t-mono text-dusk">Sample Job Vacancy</span>
                <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] tracking-tight text-frost">
                  {vacancy.position}
                </h2>
                <div className="mt-6 grid gap-3 text-sm text-mist sm:grid-cols-2">
                  <div>
                    <span className="t-mono text-dusk">Department</span>
                    <p className="mt-1 text-frost">{vacancy.department}</p>
                  </div>
                  <div>
                    <span className="t-mono text-dusk">Employment Type</span>
                    <p className="mt-1 text-frost">{vacancy.employmentType}</p>
                  </div>
                  <div>
                    <span className="t-mono text-dusk">Work Arrangement</span>
                    <p className="mt-1 text-frost">{vacancy.workArrangement}</p>
                  </div>
                </div>

                <p className="t-body mt-7 text-mist/90">{vacancy.description}</p>
              </div>
            </div>

            {/* Responsibilities, qualifications + application form */}
            <div className="grid lg:grid-cols-2">
              <div className="p-6 sm:p-8 lg:p-10 lg:pr-8">
                <h3 className="font-display text-lg tracking-tight text-frost">Responsibilities</h3>
                <ul className="mt-4 grid gap-2.5 text-sm text-mist/85">
                  {vacancy.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-1.5 size-1.5 rounded-full bg-ice" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-8 font-display text-lg tracking-tight text-frost">Qualifications</h3>
                <ul className="mt-4 grid gap-2.5 text-sm text-mist/85">
                  {vacancy.qualifications.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-1.5 size-1.5 rounded-full bg-aura" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="t-body mt-8 text-mist/90">{vacancy.howToApply}</p>
              </div>

              {/* Application Form */}
              <div className="border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-9">
                <h3 className="font-display text-xl tracking-tight text-frost">Application Form</h3>
                <p className="t-body mt-2 text-mist/85">
                  This is a <span className="text-frost">sample</span> vacancy for {identity.name}.
                  The form is for demonstration only — it does not submit to a backend.
                </p>

                {status === 'submitted' && serverMessage ? (
                  <div className="mt-6 flex gap-3 rounded-2xl border border-ice/40 bg-ice/10 p-4" role="status" aria-live="polite">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-ice" aria-hidden="true" />
                    <p className="text-sm text-mist/90">{serverMessage}</p>
                  </div>
                ) : null}

                <form id={FORM_ID} noValidate className="mt-6 grid gap-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="field-label" htmlFor="app-fullname">
                      Full Name
                    </label>
                    <input
                      id="app-fullname"
                      className="field-input"
                      value={values.fullName}
                      onChange={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      aria-invalid={Boolean(errors.fullName)}
                      autoComplete="name"
                    />
                    {errors.fullName ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.fullName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="app-email">
                      Email Address
                    </label>
                    <input
                      id="app-email"
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
                    <label className="field-label" htmlFor="app-position">
                      Position Applying For
                    </label>
                    <select
                      id="app-position"
                      className="field-input"
                      value={values.position}
                      onChange={handleChange('position')}
                      onBlur={handleBlur('position')}
                      aria-invalid={Boolean(errors.position)}
                    >
                      {applicationPositions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.position ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.position}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="app-portfolio">
                      Portfolio URL
                    </label>
                    <input
                      id="app-portfolio"
                      type="url"
                      className="field-input"
                      placeholder="https://your-portfolio.com"
                      value={values.portfolio}
                      onChange={handleChange('portfolio')}
                      onBlur={handleBlur('portfolio')}
                      aria-invalid={Boolean(errors.portfolio)}
                      autoComplete="url"
                    />
                    {errors.portfolio ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.portfolio}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="field-label" htmlFor="app-intro">
                      Short Introduction
                    </label>
                    <textarea
                      id="app-intro"
                      className="field-input min-h-[140px] resize-y"
                      value={values.introduction}
                      onChange={handleChange('introduction')}
                      onBlur={handleBlur('introduction')}
                      aria-invalid={Boolean(errors.introduction)}
                      placeholder="Tell us a little about yourself, your work, and what draws you to Devora."
                    />
                    {errors.introduction ? (
                      <p className="field-error">
                        <AlertCircle className="size-3.5" aria-hidden="true" />
                        {errors.introduction}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <p className="text-xs text-dusk">
                      By submitting, you acknowledge this is a sample demonstration.
                    </p>
                    <Button type="submit" size="lg" icon={Send} disabled={isSubmitting}>
                      Submit Application
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

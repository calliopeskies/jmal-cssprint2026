import { useMemo, useState } from "react"
import { ArrowIcon, CheckIcon, SearchIcon } from "./SectionIcons"

type Opportunity = {
  id: number
  partner: string
  title: string
  type: string
  description: string
  eligibility: string
  deadline: string
  offers: string[]
  requirements: string[]
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    partner: "Haraya Retail Group",
    title: "Holiday MSME Market Fair",
    type: "Market fair",
    description:
      "A fictional three-day selling space for local food and retail businesses.",
    eligibility: "Metro Manila MSMEs with current business permits",
    deadline: "Sample deadline · Nov 15, 2026",
    offers: [
      "Three-day selling booth",
      "Basic merchandising orientation",
      "Shared event promotions",
    ],
    requirements: [
      "Business profile",
      "Barangay or mayor’s permit",
      "Product list and photos",
    ],
  },
  {
    id: 2,
    partner: "Tulay Business Foundation",
    title: "Retail Mentorship Circle",
    type: "Training",
    description:
      "A fictional six-week program covering pricing, inventory, and customer service.",
    eligibility: "Small retail businesses operating for at least six months",
    deadline: "Applications open · Sample opportunity",
    offers: [
      "Six guided group sessions",
      "One mentor consultation",
      "Practical business worksheets",
    ],
    requirements: ["Business profile", "Short business goals response"],
  },
  {
    id: 3,
    partner: "Bayanihan Supply Network",
    title: "Local Supplier Matching",
    type: "Partnership",
    description:
      "A fictional supplier introduction program for neighborhood stores.",
    eligibility: "Registered retail businesses in Luzon",
    deadline: "Rolling applications · Sample opportunity",
    offers: [
      "Supplier introductions",
      "Product catalog access",
      "Optional group purchasing",
    ],
    requirements: ["Business profile", "Selected registration document"],
  },
]

const steps = ["Business", "Questions", "Documents", "Review"]

export default function Resources({ businessName }: { businessName: string }) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")
  const [selected, setSelected] = useState<Opportunity | null>(null)
  const [applying, setApplying] = useState(false)
  const [step, setStep] = useState(0)
  const [documents, setDocuments] = useState<Record<string, boolean>>({})
  const [shareSummary, setShareSummary] = useState(false)
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const visible = useMemo(
    () =>
      opportunities.filter(
        (item) =>
          (filter === "All" || item.type === filter) &&
          `${item.title} ${item.partner}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [filter, query],
  )

  function closeDetail() {
    setSelected(null)
    setApplying(false)
    setStep(0)
    setConsent(false)
  }

  if (submitted && selected) {
    return (
      <main className="product-page resource-confirmation">
        <span className="confirmation-mark">
          <CheckIcon />
        </span>
        <h1>Application submitted</h1>
        <p>
          Your sample application for <strong>{selected.title}</strong> is now
          marked as Submitted.
        </p>
        <div className="confirmation-actions">
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setSubmitted(false)
              setShowTracking(true)
              closeDetail()
            }}
          >
            Track application
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setSubmitted(false)
              closeDetail()
            }}
          >
            Back to Resources
          </button>
        </div>
        <small>
          Prototype only — no information was sent to a real organization.
        </small>
      </main>
    )
  }

  if (applying && selected) {
    return (
      <main className="product-page application-page">
        <button
          className="back-button"
          type="button"
          onClick={() => setApplying(false)}
        >
          ‹ Back to opportunity
        </button>
        <header className="application-header">
          <div>
            <h1>Apply to {selected.title}</h1>
            <p>Fictional prototype application</p>
          </div>
          <span>
            Step {step + 1} of {steps.length}
          </span>
        </header>
        <ol className="application-progress">
          {steps.map((label, index) => (
            <li className={index <= step ? "is-current" : ""} key={label}>
              <span>{index < step ? <CheckIcon /> : index + 1}</span>
              <small>{label}</small>
            </li>
          ))}
        </ol>
        <section className="application-form">
          {step === 0 && (
            <div className="application-step">
              <h2>Confirm your business</h2>
              <p>
                Review the profile that will identify your business in this
                application.
              </p>
              <dl className="review-list">
                <div>
                  <dt>Business</dt>
                  <dd>{businessName}</dd>
                </div>
                <div>
                  <dt>Industry</dt>
                  <dd>Retail</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>Quezon City</dd>
                </div>
              </dl>
              <p className="permission-note">
                Only these basic profile details are included at this step.
              </p>
            </div>
          )}
          {step === 1 && (
            <div className="application-step">
              <h2>Tell the partner about your business</h2>
              <label className="section-field">
                <span>What do you hope to gain from this opportunity?</span>
                <textarea
                  placeholder="Share a short, practical answer"
                  required
                />
              </label>
              <label className="section-field">
                <span>How long has your business been operating?</span>
                <select>
                  <option>Less than 1 year</option>
                  <option>1–3 years</option>
                  <option>More than 3 years</option>
                </select>
              </label>
            </div>
          )}
          {step === 2 && (
            <div className="application-step">
              <h2>Select documents</h2>
              <p>
                Choose only the records you want to share with{" "}
                {selected.partner}.
              </p>
              <div className="document-consent-list">
                {selected.requirements
                  .filter(
                    (item) =>
                      item.toLowerCase().includes("permit") ||
                      item.toLowerCase().includes("registration"),
                  )
                  .map((item) => (
                    <label key={item}>
                      <input
                        type="checkbox"
                        checked={Boolean(documents[item])}
                        onChange={(event) =>
                          setDocuments((values) => ({
                            ...values,
                            [item]: event.target.checked,
                          }))
                        }
                      />
                      <span>
                        <strong>{item}</strong>
                        <small>
                          Required to confirm business registration.
                        </small>
                      </span>
                    </label>
                  ))}
                <label>
                  <input
                    type="checkbox"
                    checked={shareSummary}
                    onChange={(event) => setShareSummary(event.target.checked)}
                  />
                  <span>
                    <strong>Income summary (optional)</strong>
                    <small>
                      Not required. Share only if you choose to support your
                      application.
                    </small>
                  </span>
                </label>
              </div>
              <p className="private-data-note compact">
                Tax documents, complete transaction history, balances, and
                personal records are not shared.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="application-step">
              <h2>Review what you will share</h2>
              <p>
                This information will be shared only with authorized reviewers
                at <strong>{selected.partner}</strong> for this application.
              </p>
              <div className="share-review">
                <div>
                  <strong>Business profile</strong>
                  <span>Name, industry, and general location</span>
                  <b>Required</b>
                </div>
                {Object.entries(documents)
                  .filter(([, checked]) => checked)
                  .map(([name]) => (
                    <div key={name}>
                      <strong>{name}</strong>
                      <span>Selected business document</span>
                      <b>Selected</b>
                    </div>
                  ))}
                {shareSummary && (
                  <div>
                    <strong>Income summary</strong>
                    <span>
                      Selected summary only; no full transaction history
                    </span>
                    <b>Optional</b>
                  </div>
                )}
              </div>
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>
                  I consent to share the information listed above with{" "}
                  {selected.partner} for this application.
                </span>
              </label>
              <p className="permission-note">
                Public profile visibility and this application consent are
                separate permissions.
              </p>
            </div>
          )}
          <div className="application-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() =>
                step === 0 ? setApplying(false) : setStep((value) => value - 1)
              }
            >
              {step === 0 ? "Cancel" : "Back"}
            </button>
            <button
              className="primary-button"
              type="button"
              disabled={step === 3 && !consent}
              onClick={() =>
                step === 3 ? setSubmitted(true) : setStep((value) => value + 1)
              }
            >
              {step === 3 ? "Submit application" : "Continue"}
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (selected) {
    return (
      <main className="product-page opportunity-detail">
        <button className="back-button" type="button" onClick={closeDetail}>
          ‹ Back to Resources
        </button>
        <header>
          <span className="opportunity-type">{selected.type}</span>
          <p>{selected.partner} · Fictional sample partner</p>
          <h1>{selected.title}</h1>
          <p>{selected.description}</p>
        </header>
        <div className="opportunity-detail-grid">
          <div>
            <section>
              <h2>What this offers</h2>
              <ul>
                {selected.offers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2>Who can apply</h2>
              <p>{selected.eligibility}</p>
            </section>
            <section>
              <h2>What you need</h2>
              <ul>
                {selected.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
          <aside>
            <span>Application timing</span>
            <strong>{selected.deadline}</strong>
            <p>
              Confirm dates and requirements with the partner before applying to
              a real program.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => setApplying(true)}
            >
              Apply
            </button>
          </aside>
        </div>
      </main>
    )
  }

  return (
    <main className="product-page resources-page">
      <header className="product-page-header">
        <div>
          <h1>Resources</h1>
          <p>Fictional sample opportunities for business growth</p>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setShowTracking(!showTracking)}
        >
          {showTracking ? "Browse opportunities" : "Track applications"}
        </button>
      </header>
      {showTracking ? (
        <section className="tracking-section">
          <div className="panel-heading">
            <div>
              <h2>Applications</h2>
              <p>Prototype status tracking</p>
            </div>
          </div>
          <div className="application-list">
            <button
              type="button"
              onClick={() => {
                setSelected(opportunities[1])
                setApplying(true)
                setStep(1)
              }}
            >
              <span>
                <strong>Retail Mentorship Circle</strong>
                <small>Tulay Business Foundation</small>
              </span>
              <b className="application-status draft">Draft</b>
              <ArrowIcon />
            </button>
            <div>
              <span>
                <strong>Community Store Showcase</strong>
                <small>Sample partner organization</small>
              </span>
              <b className="application-status review">Under review</b>
              <ArrowIcon />
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="resources-toolbar">
            <label className="section-search">
              <SearchIcon />
              <span className="sr-only">Search opportunities</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search opportunities"
              />
            </label>
            <select
              className="range-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Opportunity type"
            >
              <option>All</option>
              <option>Market fair</option>
              <option>Training</option>
              <option>Partnership</option>
            </select>
          </div>
          <div className="opportunity-list">
            {visible.map((item) => (
              <article className="opportunity-card" key={item.id}>
                <div>
                  <span className="opportunity-type">{item.type}</span>
                  <small>{item.partner} · Fictional sample</small>
                </div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <dl>
                  <div>
                    <dt>Eligibility</dt>
                    <dd>{item.eligibility}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{item.deadline}</dd>
                  </div>
                </dl>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setSelected(item)}
                >
                  View opportunity <ArrowIcon />
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}

import { useState } from "react"

const publicFields = [
  ["description", "Business description"],
  ["industry", "Industry"],
  ["products", "Products and services"],
  ["location", "General location"],
  ["contact", "Public contact details"],
] as const

type BusinessProfile = {
  name: string
  initials: string
  visibility: "Public" | "Private"
  industry: string
  location: string
  description: string
  products: string
}

export default function Account({
  business,
  onVisibilityChange,
}: {
  business: BusinessProfile
  onVisibilityChange: (isPublic: boolean) => void
}) {
  const isPublic = business.visibility === "Public"
  const [editing, setEditing] = useState(false)
  const [notice, setNotice] = useState("")
  const [shared, setShared] = useState<Record<string, boolean>>({})

  return (
    <main className="product-page account-page">
      <header className="product-page-header">
        <div>
          <h1>Business Profile</h1>
          <p>Manage your business details and privacy</p>
        </div>
        <button
          className={editing ? "primary-button" : "secondary-button"}
          type="button"
          onClick={() => {
            if (editing) setNotice("Business profile saved.")
            setEditing(!editing)
          }}
        >
          {editing ? "Save profile" : "Edit profile"}
        </button>
      </header>
      {notice && (
        <div className="section-success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Dismiss
          </button>
        </div>
      )}
      <div className="account-layout">
        <section className="profile-section">
          <div className="profile-identity">
            <span>{business.initials}</span>
            <div>
              <h2>{business.name}</h2>
              <p>
                {business.industry} · {business.location}
              </p>
            </div>
          </div>
          <div className="profile-fields">
            <label>
              <span>Business name</span>
              <input defaultValue={business.name} disabled={!editing} />
            </label>
            <label>
              <span>Business description</span>
              <textarea
                defaultValue={business.description}
                disabled={!editing}
              />
            </label>
            <div>
              <label>
                <span>Industry</span>
                <input defaultValue={business.industry} disabled={!editing} />
              </label>
              <label>
                <span>General location</span>
                <input defaultValue={business.location} disabled={!editing} />
              </label>
            </div>
            <label>
              <span>Products and services</span>
              <input defaultValue={business.products} disabled={!editing} />
            </label>
            <label>
              <span>Public contact (optional)</span>
              <input
                defaultValue=""
                placeholder="Not provided"
                disabled={!editing}
              />
            </label>
          </div>
        </section>
        <aside className="privacy-section">
          <div className="panel-heading">
            <div>
              <h2>Profile visibility</h2>
              <p>
                Control whether people can find your basic business profile.
              </p>
            </div>
          </div>
          <label className="visibility-toggle">
            <span>
              <strong>Publicly discoverable</strong>
              <small>Sensitive records always stay private.</small>
            </span>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => {
                onVisibilityChange(event.target.checked)
                setNotice(
                  `Business profile is now ${
                    event.target.checked ? "Public" : "Private"
                  }.`,
                )
              }}
            />
          </label>
          {isPublic && (
            <fieldset className="sharing-fields">
              <legend>Information shown publicly</legend>
              {publicFields.map(([key, label]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={Boolean(shared[key])}
                    onChange={(event) =>
                      setShared((values) => ({
                        ...values,
                        [key]: event.target.checked,
                      }))
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
          )}
          <div className="private-data-note">
            <strong>Always private</strong>
            <p>
              Tax IDs, tax returns, balances, transactions, personal
              information, and private documents are never included in your
              public profile.
            </p>
          </div>
          <p className="permission-note">
            Public profile visibility does not give partners permission to view
            documents or financial records. You choose what to share for each
            application.
          </p>
        </aside>
      </div>
    </main>
  )
}

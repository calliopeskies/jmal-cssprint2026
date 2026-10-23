import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode, SVGProps } from "react"

const Account = lazy(() => import("./Account"))
const Finance = lazy(() => import("./Finance"))
const Inventory = lazy(() => import("./Inventory"))
const Resources = lazy(() => import("./Resources"))

type IconProps = SVGProps<SVGSVGElement>

function Icon({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

const HomeIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v11h14V9M9 20v-6h6v6" />
  </Icon>
)

const FileIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v5h4M9 13h6M9 17h5" />
  </Icon>
)

const WalletIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 7h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V7a3 3 0 0 1 3-3h13" />
    <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
  </Icon>
)

const BoxIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m4 7 8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10" />
  </Icon>
)

const MoreIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
  </Icon>
)

const BellIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
  </Icon>
)

const ArrowUpIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
  </Icon>
)

const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

const UploadIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5M5 14v6h14v-6" />
  </Icon>
)

const ChevronIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
)

const ClockIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
)

const TrendIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m4 15 5-5 4 4 7-7" />
    <path d="M15 7h5v5" />
  </Icon>
)

const SearchIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </Icon>
)

const DownloadIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 20h14" />
  </Icon>
)

const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
)

const BackIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
)

const ResourcesIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 8h16v12H4zM8 8V5h8v3M4 12h16M10 12v2h4v-2" />
  </Icon>
)

const ProfileIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Icon>
)

const navItems = [
  { label: "Home", icon: HomeIcon },
  { label: "Finance", icon: WalletIcon },
  { label: "Inventory", icon: BoxIcon },
  { label: "Records", icon: FileIcon },
  { label: "Resources", icon: ResourcesIcon },
]

type Page = "Home" | "Finance" | "Inventory" | "Records" | "Resources"
type RecordsView = "Documents" | "Business profile"
type Business = {
  id: string
  name: string
  shortName: string
  initials: string
  visibility: "Public" | "Private"
  industry: string
  location: string
  description: string
  products: string
}

const sampleBusinesses: Business[] = [
  {
    id: "sari-sari",
    name: "Juan’s Sari-Sari Store",
    shortName: "Juan’s Sari-Sari",
    initials: "JS",
    visibility: "Private",
    industry: "Retail",
    location: "Quezon City, Metro Manila",
    description:
      "Neighborhood store offering everyday food, drinks, and household essentials.",
    products: "Groceries, snacks, beverages, household essentials",
  },
  {
    id: "lago-bakes",
    name: "Lago Bakes",
    shortName: "Lago Bakes",
    initials: "LB",
    visibility: "Public",
    industry: "Food and beverage",
    location: "Marikina City, Metro Manila",
    description:
      "Home bakery making celebration cakes, pastries, and made-to-order desserts.",
    products: "Cakes, pastries, dessert boxes, made-to-order baked goods",
  },
]
type DocumentStatus = "Active" | "Expiring soon" | "Expired"

type DocumentRecord = {
  id: number
  title: string
  category: string
  status: DocumentStatus
  expiry: string
  expiryLabel: string
  reference: string
  updated: string
  versions: { version: string date: string note: string }[]
  requirementId?: string
  agency?: string
  issueDate?: string
  notes?: string
  sample?: boolean
}

type UploadTarget = {
  requirementId?: string
  name: string
  category: string
  noExpiry?: boolean
}

const documentCategories = [
  "Business registration",
  "Permits and clearances",
  "Tax records",
  "Financial records",
  "Invoices and receipts",
  "Contracts and agreements",
  "Other documents",
]

const sampleRequirements = [
  {
    id: "barangay-clearance",
    name: "Barangay business clearance",
    category: "Permits and clearances",
    nextStep: "Review the upcoming renewal.",
  },
  {
    id: "mayors-permit",
    name: "Mayor’s business permit",
    category: "Permits and clearances",
    nextStep: "Add an expiry date if applicable.",
  },
  {
    id: "bir-registration",
    name: "BIR Certificate of Registration",
    category: "Tax records",
    nextStep: "Upload the required document.",
    noExpiry: true,
  },
  {
    id: "sanitary-permit",
    name: "Sanitary permit",
    category: "Permits and clearances",
    nextStep: "Review whether renewal is needed for this business.",
  },
  {
    id: "financial-summary",
    name: "Recent financial record",
    category: "Financial records",
    nextStep: "Upload a recent owner-prepared financial record.",
  },
] as const

const initialDocuments: DocumentRecord[] = [
  {
    id: 1,
    title: "Barangay Business Clearance",
    category: "Permits and clearances",
    status: "Expiring soon",
    expiry: "June 22, 2025",
    expiryLabel: "5 days left",
    reference: "BBC-2024-01892",
    updated: "January 12, 2025",
    requirementId: "barangay-clearance",
    agency: "Barangay office",
    sample: true,
    versions: [
      {
        version: "Version 2",
        date: "Jan 12, 2025",
        note: "Current document",
      },
      {
        version: "Version 1",
        date: "Jan 8, 2024",
        note: "Previous renewal",
      },
    ],
  },
  {
    id: 2,
    title: "Mayor’s Business Permit",
    category: "Permits and clearances",
    status: "Active",
    expiry: "January 15, 2026",
    expiryLabel: "212 days left",
    reference: "MBP-QC-25-10482",
    updated: "January 15, 2025",
    requirementId: "mayors-permit",
    agency: "City business permits office",
    sample: true,
    versions: [
      {
        version: "Version 3",
        date: "Jan 15, 2025",
        note: "Current document",
      },
      {
        version: "Version 2",
        date: "Jan 16, 2024",
        note: "Previous renewal",
      },
      {
        version: "Version 1",
        date: "Jan 18, 2023",
        note: "Original upload",
      },
    ],
  },
  {
    id: 3,
    title: "BIR Certificate of Registration",
    category: "Tax records",
    status: "Active",
    expiry: "No expiry",
    expiryLabel: "No expiry",
    reference: "TIN 123-456-789-000",
    updated: "September 4, 2023",
    requirementId: "bir-registration",
    agency: "Bureau of Internal Revenue",
    sample: true,
    versions: [
      {
        version: "Version 1",
        date: "Sep 4, 2023",
        note: "Current document",
      },
    ],
  },
  {
    id: 4,
    title: "Sanitary Permit",
    category: "Permits and clearances",
    status: "Expired",
    expiry: "May 30, 2025",
    expiryLabel: "Expired 18 days ago",
    reference: "SP-2024-7721",
    updated: "May 30, 2024",
    requirementId: "sanitary-permit",
    agency: "Local health office",
    sample: true,
    versions: [
      {
        version: "Version 1",
        date: "May 30, 2024",
        note: "Current document",
      },
    ],
  },
]

function Brand() {
  return (
    <div className="brand" aria-label="JMALago">
      <span className="brand-mark" aria-hidden="true">
        J
      </span>
      <span className="brand-name">JMALago</span>
    </div>
  )
}

function IconButton({
  label,
  children,
  onClick,
}: {
  label: string
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      className="icon-button"
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function Navigation({
  desktop = false,
  currentPage,
  onNavigate,
}: {
  desktop?: boolean
  currentPage: Page
  onNavigate: (page: Page) => void
}) {
  return (
    <nav
      className={desktop ? "desktop-nav" : "bottom-nav"}
      aria-label="Primary navigation"
    >
      {navItems.map(({ label, icon: NavIcon }) => {
        const active = label === currentPage
        return (
          <button
            className={`nav-item${active ? " nav-item-active" : ""}`}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onNavigate(label as Page)}
            key={label}
          >
            <NavIcon className="nav-icon" />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function SummaryMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "positive" | "negative"
}) {
  return (
    <div className="summary-metric">
      <span className="metric-label">{label}</span>
      <span className={`metric-value metric-${tone}`}>{value}</span>
    </div>
  )
}

function ProfitSummary({ businessId }: { businessId: string }) {
  const isBakery = businessId === "lago-bakes"
  return (
    <section className="profit-card" aria-labelledby="profit-title">
      <div className="profit-heading">
        <div>
          <p className="eyebrow" id="profit-title">
            Net profit
          </p>
          <p className="period">This month · June 2025</p>
        </div>
        <span className="status-chip">
          <TrendIcon className="chip-icon" />
          8.4%
        </span>
      </div>

      <p className="profit-value">{isBakery ? "₱31,280.00" : "₱48,650.00"}</p>
      <p className="profit-comparison">
        {isBakery
          ? "₱2,140 more than last month"
          : "₱3,760 more than last month"}
      </p>

      <div className="summary-metrics">
        <SummaryMetric
          label="Sales"
          value={isBakery ? "₱84,760" : "₱126,450"}
          tone="positive"
        />
        <SummaryMetric
          label="Expenses"
          value={isBakery ? "₱53,480" : "₱77,800"}
          tone="negative"
        />
      </div>
    </section>
  )
}

function AttentionItem({
  icon,
  title,
  detail,
  meta,
  urgent,
}: {
  icon: ReactNode
  title: string
  detail: string
  meta: string
  urgent?: boolean
}) {
  return (
    <button className="attention-item" type="button">
      <span
        className={`attention-icon${urgent ? " attention-icon-urgent" : ""}`}
      >
        {icon}
      </span>
      <span className="attention-copy">
        <span className="attention-title">{title}</span>
        <span className="attention-detail">{detail}</span>
      </span>
      <span
        className={`attention-meta${urgent ? " attention-meta-urgent" : ""}`}
      >
        {meta}
      </span>
      <ChevronIcon className="chevron-icon" />
    </button>
  )
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button className="quick-action" type="button" onClick={onClick}>
      <span className="quick-action-icon">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function DashboardContent({
  business,
  onRecordSale,
  onAddExpense,
  onUploadDocument,
  onBusinessProfile,
}: {
  business: Business
  onRecordSale: () => void
  onAddExpense: () => void
  onUploadDocument: () => void
  onBusinessProfile: () => void
}) {
  return (
    <main className="dashboard">
      <section className="greeting" aria-labelledby="greeting-title">
        <p className="date-label">Tuesday, June 17</p>
        <h1 id="greeting-title">Good morning, Juan.</h1>
        <p>Here’s how {business.name} is doing.</p>
      </section>

      <div className="dashboard-grid">
        <div className="primary-column">
          <ProfitSummary businessId={business.id} />

          <section className="section-block" aria-labelledby="actions-title">
            <div className="section-heading">
              <h2 id="actions-title">Quick actions</h2>
            </div>
            <div className="quick-actions">
              <QuickAction
                label="Record sale"
                icon={<ArrowUpIcon className="action-icon" />}
                onClick={onRecordSale}
              />
              <QuickAction
                label="Add expense"
                icon={<PlusIcon className="action-icon" />}
                onClick={onAddExpense}
              />
              <QuickAction
                label="Upload document"
                icon={<UploadIcon className="action-icon" />}
                onClick={onUploadDocument}
              />
              <QuickAction
                label="Business profile"
                icon={<ProfileIcon className="action-icon" />}
                onClick={onBusinessProfile}
              />
            </div>
          </section>
        </div>

        <section
          className="section-block attention-section"
          aria-labelledby="attention-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="attention-title">Needs your attention</h2>
              <p>2 items to review</p>
            </div>
            <button className="text-button" type="button">
              View all
            </button>
          </div>
          <div className="attention-list">
            <AttentionItem
              icon={<FileIcon />}
              title="Barangay permit"
              detail="Renewal deadline"
              meta="Due in 5 days"
              urgent
            />
            <AttentionItem
              icon={<BoxIcon />}
              title={business.id === "lago-bakes" ? "Butter" : "Cooking oil"}
              detail={
                business.id === "lago-bakes"
                  ? "1.5 kg remaining"
                  : "3 bottles remaining"
              }
              meta="Low stock"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={`document-status document-status-${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  )
}

function DocumentRow({
  document,
  selected,
  onSelect,
}: {
  document: DocumentRecord
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={`document-row${selected ? " document-row-selected" : ""}`}
      type="button"
      onClick={onSelect}
    >
      <span className="document-file-icon">
        <FileIcon />
      </span>
      <span className="document-row-copy">
        <span className="document-row-heading">
          <strong>{document.title}</strong>
          <StatusBadge status={document.status} />
        </span>
        <span className="document-row-meta">
          {document.category}
          <span aria-hidden="true">·</span>
          {document.expiryLabel}
        </span>
      </span>
      <ChevronIcon className="document-chevron" />
    </button>
  )
}

function downloadMockDocument(document: DocumentRecord) {
  const content = [
    "JMALAGO DOCUMENT PREVIEW",
    "",
    document.title,
    `Reference: ${document.reference}`,
    `Status: ${document.status}`,
    `Expiry: ${document.expiry}`,
    "",
    "This is a simulated document generated for the JMALago prototype.",
  ].join("\n")
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }))
  const link = window.document.createElement("a")
  link.href = url
  link.download = `${document.title.toLowerCase().replaceAll(" ", "-")}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

function DocumentDetails({
  document,
  onBack,
  onUpdate,
}: {
  document: DocumentRecord
  onBack: () => void
  onUpdate: (document: DocumentRecord) => void
}) {
  const [editing, setEditing] = useState(false)
  const [agency, setAgency] = useState(document.agency ?? "")
  const [issueDate, setIssueDate] = useState(document.issueDate ?? "")
  const [expiry, setExpiry] = useState(document.expiry)
  const [notes, setNotes] = useState(document.notes ?? "")
  const [replacement, setReplacement] = useState("")

  function saveDetails() {
    onUpdate({
      ...document,
      agency,
      issueDate,
      expiry,
      expiryLabel: expiry,
      notes,
      updated: "Just now",
    })
    setEditing(false)
  }

  return (
    <aside
      className="document-details"
      aria-label={`${document.title} details`}
    >
      <div className="detail-mobile-header">
        <button className="back-button" type="button" onClick={onBack}>
          <BackIcon />
          Documents
        </button>
      </div>
      <div className="detail-heading">
        <span className="document-file-icon document-file-icon-large">
          <FileIcon />
        </span>
        <div>
          <p className="detail-category">{document.category}</p>
          <h2>{document.title}</h2>
        </div>
      </div>
      <StatusBadge status={document.status} />

      <dl className="document-facts">
        <div>
          <dt>Expiry date</dt>
          <dd>{document.expiry}</dd>
        </div>
        <div>
          <dt>Reference no.</dt>
          <dd>{document.reference}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{document.updated}</dd>
        </div>
      </dl>
      <button
        className="text-button document-edit-button"
        type="button"
        onClick={() => setEditing(!editing)}
      >
        {editing ? "Cancel editing" : "Edit details"}
      </button>
      {editing && (
        <div className="document-metadata-form">
          <label>
            <span>Issuing agency</span>
            <input
              value={agency}
              onChange={(event) => setAgency(event.target.value)}
            />
          </label>
          <label>
            <span>Issue date</span>
            <input
              type="date"
              value={issueDate}
              onChange={(event) => setIssueDate(event.target.value)}
            />
          </label>
          <label>
            <span>Expiry date</span>
            <input
              value={expiry}
              onChange={(event) => setExpiry(event.target.value)}
              placeholder="No expiry or date"
            />
          </label>
          <label>
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <button
            className="primary-button"
            type="button"
            onClick={saveDetails}
          >
            Save details
          </button>
          <small>
            Editing details does not replace or modify the uploaded file.
          </small>
        </div>
      )}

      <button
        className="secondary-button detail-download"
        type="button"
        onClick={() => downloadMockDocument(document)}
      >
        <DownloadIcon />
        Download mock file
      </button>
      <p className="simulation-note">
        Prototype file only — no cloud document is connected.
      </p>
      <label className="replace-file-control">
        <span>Replace uploaded file</span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) =>
            setReplacement(event.target.files?.[0]?.name ?? "")
          }
        />
        {replacement && (
          <small>
            {replacement} selected. Saving a replacement would create a new file
            version.
          </small>
        )}
      </label>
      {document.sample && (
        <p className="sample-document-label">
          Illustrative sample document · Not officially verified
        </p>
      )}

      <section className="version-section" aria-labelledby="version-title">
        <div className="section-heading">
          <h3 id="version-title">Version history</h3>
          <span>{document.versions.length} versions</span>
        </div>
        <ol className="version-list">
          {document.versions.map((version, index) => (
            <li key={version.version}>
              <span
                className={`version-dot${
                  index === 0 ? " version-dot-current" : ""
                }`}
              />
              <span>
                <strong>{version.version}</strong>
                <small>{version.note}</small>
              </span>
              <time>{version.date}</time>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  )
}

function UploadDialog({
  onClose,
  onUpload,
  target,
}: {
  onClose: () => void
  onUpload: (details: {
    title: string
    category: string
    expiry: string
    requirementId?: string
    agency?: string
    issueDate?: string
    notes?: string
  }) => void
  target: UploadTarget | null
}) {
  const [fileName, setFileName] = useState("")
  const [title, setTitle] = useState(target?.name ?? "")
  const [category, setCategory] = useState(
    target?.category ?? "Business registration",
  )
  const [noExpiry, setNoExpiry] = useState(Boolean(target?.noExpiry))
  const [expiry, setExpiry] = useState("")
  const [agency, setAgency] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [notes, setNotes] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!fileName) return
    onUpload({
      title: title || fileName.replace(/\.[^/.]+$/, ""),
      category,
      expiry: noExpiry ? "No expiry" : expiry || "Not set",
      requirementId: target?.requirementId,
      agency,
      issueDate,
      notes,
    })
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="upload-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-heading">
          <div>
            <h2 id="upload-title">Upload document</h2>
            <p>
              {target
                ? `Add this file to ${target.name}.`
                : "Add a private business document."}
            </p>
          </div>
          <IconButton label="Close upload dialog" onClick={onClose}>
            <CloseIcon className="control-icon" />
          </IconButton>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Document file</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) =>
                setFileName(event.target.files?.[0]?.name ?? "")
              }
              required
            />
            <small>PDF, JPG, or PNG · Prototype only</small>
          </label>
          <label className="form-field">
            <span>Document name</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Filled from the file name if left blank"
            />
          </label>
          <label className="form-field">
            <span>Category</span>
            {target ? (
              <input value={category} readOnly />
            ) : (
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {documentCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            )}
          </label>
          <label className="no-expiry-control">
            <input
              type="checkbox"
              checked={noExpiry}
              onChange={(event) => setNoExpiry(event.target.checked)}
            />
            <span>No expiry date or not applicable</span>
          </label>
          {!noExpiry && (
            <label className="form-field">
              <span>Expiry date, if applicable</span>
              <input
                type="date"
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
              />
            </label>
          )}
          <details className="upload-extra-details">
            <summary>Edit details</summary>
            <div>
              <label className="form-field">
                <span>Issuing agency (optional)</span>
                <input
                  value={agency}
                  onChange={(event) => setAgency(event.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Issue date (optional)</span>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(event) => setIssueDate(event.target.value)}
                />
              </label>
              <label className="form-field">
                <span>Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>
          </details>
          <div className="dialog-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={!fileName}
            >
              Upload document
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function DocumentsContent({
  businessId,
  uploadRequest,
  onUploadRequestHandled,
}: {
  businessId: string
  uploadRequest: number
  onUploadRequestHandled: () => void
}) {
  const [documents, setDocuments] = useState(() =>
    businessId === "lago-bakes"
      ? [
          {
            ...initialDocuments[0],
            id: 11,
            title: "Barangay Clearance — Lago Bakes",
            reference: "BBC-2026-04118",
          },
          {
            ...initialDocuments[2],
            id: 12,
            title: "BIR Registration — Lago Bakes",
            reference: "TIN 987-654-321-000",
          },
        ]
      : initialDocuments,
  )
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"All" | DocumentStatus>("All")
  const [selectedId, setSelectedId] = useState(1)
  const [showDetails, setShowDetails] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")
  const [uploadTarget, setUploadTarget] = useState<UploadTarget | null>(null)
  const [recordsArea, setRecordsArea] =
    useState<"Business Documents" | "Requirements" | "Upcoming Actions">(
      "Business Documents",
    )

  useEffect(() => {
    if (uploadRequest <= 0) return
    setUploadTarget(null)
    setShowUpload(true)
    onUploadRequestHandled()
  }, [onUploadRequestHandled, uploadRequest])

  const filteredDocuments = useMemo(
    () =>
      documents.filter(
        (document) =>
          (filter === "All" || document.status === filter) &&
          `${document.title} ${document.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [documents, filter, query],
  )
  const selectedDocument =
    documents.find((document) => document.id === selectedId) ?? documents[0]

  function selectDocument(id: number) {
    setSelectedId(id)
    setShowDetails(true)
  }

  function addDocument(details: {
    title: string
    category: string
    expiry: string
    requirementId?: string
    agency?: string
    issueDate?: string
    notes?: string
  }) {
    const newDocument: DocumentRecord = {
      id: Date.now(),
      title: details.title,
      category: details.category,
      status: "Active",
      expiry: details.expiry,
      expiryLabel:
        details.expiry === "No expiry" ? "No expiry" : details.expiry,
      reference: "Pending",
      updated: "Just now",
      requirementId: details.requirementId,
      agency: details.agency,
      issueDate: details.issueDate,
      notes: details.notes,
      versions: [
        { version: "Version 1", date: "Just now", note: "Current document" },
      ],
    }
    setDocuments((current) => [newDocument, ...current])
    setSelectedId(newDocument.id)
    setShowUpload(false)
    setUploadTarget(null)
    setRecordsArea("Business Documents")
    setUploadMessage(`${details.title} was added to this prototype.`)
  }

  function openTargetUpload(target: UploadTarget) {
    setUploadTarget(target)
    setShowUpload(true)
  }

  return (
    <main
      className={`documents-page${showDetails ? " documents-show-detail" : ""}`}
    >
      <section className="documents-main" aria-labelledby="documents-title">
        <div className="page-title-row">
          <div>
            <h1 id="documents-title">Records</h1>
            <p>Organize business documents and see what needs attention.</p>
          </div>
          <button
            className="primary-button upload-button"
            type="button"
            onClick={() => {
              setUploadTarget(null)
              setShowUpload(true)
            }}
          >
            <UploadIcon />
            Upload
          </button>
        </div>

        {uploadMessage && (
          <div className="success-message" role="status">
            <span>{uploadMessage}</span>
            <button
              type="button"
              onClick={() => setUploadMessage("")}
              aria-label="Dismiss"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div
          className="records-area-tabs"
          role="tablist"
          aria-label="Record areas"
        >
          {([
            "Business Documents",
            "Requirements",
            "Upcoming Actions",
          ] as const).map((area) => (
            <button
              className={recordsArea === area ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={recordsArea === area}
              onClick={() => {
                setRecordsArea(area)
                setShowDetails(false)
              }}
              key={area}
            >
              {area}
            </button>
          ))}
        </div>

        {recordsArea === "Business Documents" && (
          <>
            <p className="records-sample-note">
              Example documents for this fictional business · Private by default
            </p>
            <div className="document-toolbar">
              <label className="search-field">
                <SearchIcon />
                <span className="sr-only">Search documents</span>
                <input
                  type="search"
                  placeholder="Search documents"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div
                className="filter-scroll"
                aria-label="Filter documents by status"
              >
                {(["All", "Active", "Expiring soon", "Expired"] as const).map(
                  (status) => (
                    <button
                      className={`filter-button${
                        filter === status ? " filter-button-active" : ""
                      }`}
                      type="button"
                      aria-pressed={filter === status}
                      onClick={() => setFilter(status)}
                      key={status}
                    >
                      {status}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="document-list-heading">
              <span>{filteredDocuments.length} documents</span>
              <span>Updated recently</span>
            </div>
            <div className="document-list">
              {filteredDocuments.length ? (
                filteredDocuments.map((document) => (
                  <DocumentRow
                    document={document}
                    selected={document.id === selectedId}
                    onSelect={() => selectDocument(document.id)}
                    key={document.id}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <SearchIcon />
                  <strong>No documents found</strong>
                  <p>Try a different search or status filter.</p>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      setQuery("")
                      setFilter("All")
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {recordsArea === "Requirements" && (
          <section className="requirements-area">
            <div className="guided-area-heading">
              <div>
                <h2>Requirements and missing records</h2>
                <p>
                  Illustrative sample checklist — requirements vary by business.
                </p>
              </div>
            </div>
            <div className="requirement-list">
              {sampleRequirements.map((requirement) => {
                const document = documents.find(
                  (item) => item.requirementId === requirement.id,
                )
                const status = !document
                  ? "Action needed"
                  : document.status === "Expired"
                    ? "Expired"
                    : document.status === "Expiring soon"
                      ? "Expiring soon"
                      : "On file"
                return (
                  <article key={requirement.id}>
                    <span
                      className={`requirement-status status-${status.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      {status}
                    </span>
                    <div>
                      <strong>{requirement.name}</strong>
                      <small>{requirement.category} · Sample requirement</small>
                      <p>
                        {document
                          ? document.expiry === "Not set"
                            ? "Add an expiry date if applicable."
                            : requirement.nextStep
                          : requirement.nextStep}
                      </p>
                    </div>
                    {!document ? (
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                          openTargetUpload({
                            requirementId: requirement.id,
                            name: requirement.name,
                            category: requirement.category,
                            noExpiry:
                              "noExpiry" in requirement && requirement.noExpiry,
                          })
                        }
                      >
                        Upload document
                      </button>
                    ) : (
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => {
                          setRecordsArea("Business Documents")
                          selectDocument(document.id)
                        }}
                      >
                        View file
                      </button>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {recordsArea === "Upcoming Actions" && (
          <section className="upcoming-actions-area">
            <div className="guided-area-heading">
              <div>
                <h2>Upcoming actions</h2>
                <p>Based on saved sample dates and incomplete records.</p>
              </div>
            </div>
            <div className="records-action-list">
              <article className="is-overdue">
                <span>Overdue</span>
                <div>
                  <strong>Review sanitary permit renewal</strong>
                  <p>
                    The saved sample permit expired on May 30, 2025. Confirm
                    current requirements with the issuing office.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openTargetUpload({
                      requirementId: "sanitary-permit",
                      name: "Sanitary permit",
                      category: "Permits and clearances",
                    })
                  }
                >
                  Upload replacement
                </button>
              </article>
              <article>
                <span>Upcoming</span>
                <div>
                  <strong>Review barangay clearance</strong>
                  <p>
                    The saved sample document is marked as expiring soon. Its
                    expiry date is not automatically treated as a legal filing
                    deadline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRecordsArea("Requirements")}
                >
                  View requirement
                </button>
              </article>
              {!documents.some(
                (item) => item.requirementId === "financial-summary",
              ) && (
                <article>
                  <span>Incomplete</span>
                  <div>
                    <strong>Add a recent financial record</strong>
                    <p>
                      Upload an owner-prepared summary if useful for your
                      records.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openTargetUpload({
                        requirementId: "financial-summary",
                        name: "Recent financial record",
                        category: "Financial records",
                        noExpiry: true,
                      })
                    }
                  >
                    Upload record
                  </button>
                </article>
              )}
            </div>
          </section>
        )}
      </section>

      {recordsArea === "Business Documents" && (
        <DocumentDetails
          key={selectedDocument.id}
          document={selectedDocument}
          onBack={() => setShowDetails(false)}
          onUpdate={(updated) =>
            setDocuments((items) =>
              items.map((item) => (item.id === updated.id ? updated : item)),
            )
          }
        />
      )}
      {showUpload && (
        <UploadDialog
          onClose={() => setShowUpload(false)}
          onUpload={addDocument}
          target={uploadTarget}
        />
      )}
    </main>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("Home")
  const [recordsView, setRecordsView] = useState<RecordsView>("Documents")
  const [headerMessage, setHeaderMessage] = useState("")
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [businesses, setBusinesses] = useState(sampleBusinesses)
  const [activeBusinessId, setActiveBusinessId] = useState("sari-sari")
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [businessListOpen, setBusinessListOpen] = useState(false)
  const [financeShortcut, setFinanceShortcut] =
    useState<"Income" | "Expense" | null>(null)
  const [documentUploadRequest, setDocumentUploadRequest] = useState(0)
  const [notificationPreferences, setNotificationPreferences] = useState({
    weather: true,
    supply: true,
    economic: false,
    reminders: true,
    stock: true,
  })
  const activeBusiness =
    businesses.find((business) => business.id === activeBusinessId) ??
    businesses[0]

  function showNotifications() {
    setNotificationsRead(true)
    setNotificationsOpen(true)
  }

  function navigate(page: Page) {
    setCurrentPage(page)
    if (page === "Records") setRecordsView("Documents")
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <Navigation desktop currentPage={currentPage} onNavigate={navigate} />
        <button
          className="sidebar-business"
          type="button"
          onClick={() => setProfileMenuOpen(true)}
          aria-label="Open profile menu"
        >
          <span className="business-avatar">{activeBusiness.initials}</span>
          <span className="business-copy">
            <strong>{activeBusiness.shortName}</strong>
            <small>{activeBusiness.visibility}</small>
          </span>
          <MoreIcon className="sidebar-more" />
        </button>
      </aside>

      <div className="page">
        <header className="mobile-header">
          <Brand />
          <div className="header-actions">
            <IconButton label="Notifications" onClick={showNotifications}>
              <BellIcon className="control-icon" />
              {!notificationsRead && <span className="notification-dot" />}
            </IconButton>
            <button
              className="avatar-button"
              type="button"
              aria-label="Open profile"
              onClick={() => setProfileMenuOpen(true)}
            >
              {activeBusiness.initials}
            </button>
          </div>
        </header>

        <header className="desktop-header">
          <span className="desktop-page-title">{currentPage}</span>
          <div className="header-actions">
            <IconButton label="Notifications" onClick={showNotifications}>
              <BellIcon className="control-icon" />
              {!notificationsRead && <span className="notification-dot" />}
            </IconButton>
          </div>
        </header>

        <Suspense
          fallback={
            <main className="product-page">
              <p className="loading-state">Loading section…</p>
            </main>
          }
        >
          {currentPage === "Home" && (
            <DashboardContent
              business={activeBusiness}
              onRecordSale={() => {
                setFinanceShortcut("Income")
                setCurrentPage("Finance")
              }}
              onAddExpense={() => {
                setFinanceShortcut("Expense")
                setCurrentPage("Finance")
              }}
              onUploadDocument={() => {
                setRecordsView("Documents")
                setDocumentUploadRequest((value) => value + 1)
                setCurrentPage("Records")
              }}
              onBusinessProfile={() => {
                setRecordsView("Business profile")
                setCurrentPage("Records")
              }}
            />
          )}
          {currentPage === "Finance" && (
            <Finance
              key={activeBusiness.id}
              businessId={activeBusiness.id}
              requestedKind={financeShortcut}
              onRequestHandled={() => setFinanceShortcut(null)}
              onViewInventory={() => setCurrentPage("Inventory")}
            />
          )}
          {currentPage === "Inventory" && (
            <Inventory key={activeBusiness.id} businessId={activeBusiness.id} />
          )}
          {currentPage === "Resources" && (
            <Resources businessName={activeBusiness.name} />
          )}
          {currentPage === "Records" && (
            <div className="records-shell">
              <div
                className="records-tabs"
                role="tablist"
                aria-label="Records sections"
              >
                {(["Documents", "Business profile"] as const).map((view) => (
                  <button
                    className={recordsView === view ? "is-active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={recordsView === view}
                    onClick={() => setRecordsView(view)}
                    key={view}
                  >
                    {view}
                  </button>
                ))}
              </div>
              {recordsView === "Documents" ? (
                <DocumentsContent
                  key={activeBusiness.id}
                  businessId={activeBusiness.id}
                  uploadRequest={documentUploadRequest}
                  onUploadRequestHandled={() => setDocumentUploadRequest(0)}
                />
              ) : (
                <Account
                  key={activeBusiness.id}
                  business={activeBusiness}
                  onVisibilityChange={(isPublic) =>
                    setBusinesses((items) =>
                      items.map((business) =>
                        business.id === activeBusiness.id
                          ? {
                              ...business,
                              visibility: isPublic ? "Public" : "Private",
                            }
                          : business,
                      ),
                    )
                  }
                />
              )}
            </div>
          )}
        </Suspense>
        {profileMenuOpen && (
          <div
            className="profile-menu-backdrop"
            onMouseDown={() => {
              setProfileMenuOpen(false)
              setBusinessListOpen(false)
            }}
          >
            <section
              className="profile-menu"
              aria-label="Profile and business menu"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="profile-menu-heading">
                <span className="business-avatar">
                  {activeBusiness.initials}
                </span>
                <span>
                  <strong>{activeBusiness.name}</strong>
                  <small>{activeBusiness.visibility} profile</small>
                </span>
                <span className="active-business-mark">Active</span>
              </div>
              {businesses.length > 1 && (
                <>
                  <button
                    className="business-switch-toggle"
                    type="button"
                    aria-expanded={businessListOpen}
                    onClick={() => setBusinessListOpen(!businessListOpen)}
                  >
                    Switch business
                    <ChevronIcon />
                  </button>
                  {businessListOpen && (
                    <div className="business-switch-list">
                      {businesses.map((business) => (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveBusinessId(business.id)
                            setProfileMenuOpen(false)
                            setBusinessListOpen(false)
                            setHeaderMessage(`${business.name} is now active.`)
                          }}
                          key={business.id}
                        >
                          <span className="business-avatar">
                            {business.initials}
                          </span>
                          <span>
                            <strong>{business.name}</strong>
                            <small>{business.visibility}</small>
                          </span>
                          {business.id === activeBusiness.id && (
                            <b aria-label="Currently selected">✓</b>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              <div className="profile-menu-actions">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage("Records")
                    setRecordsView("Business profile")
                    setProfileMenuOpen(false)
                  }}
                >
                  View business profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage("Records")
                    setRecordsView("Business profile")
                    setProfileMenuOpen(false)
                    setHeaderMessage(
                      "Add another business setup is shown as a prototype action.",
                    )
                  }}
                >
                  <PlusIcon />
                  Add another business
                </button>
              </div>
              <p>
                Public profiles never include balances, transactions, tax
                records, private documents, or personal information.
              </p>
            </section>
          </div>
        )}
        {notificationsOpen && (
          <div
            className="notification-backdrop"
            onMouseDown={() => setNotificationsOpen(false)}
          >
            <aside
              className="notification-panel"
              aria-label="Notifications"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="notification-heading">
                <div>
                  <h2>Notifications</h2>
                  <p>Sample alerts for the prototype</p>
                </div>
                <IconButton
                  label="Close notifications"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <CloseIcon className="control-icon" />
                </IconButton>
              </div>
              <div className="notification-list">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage("Inventory")
                    setNotificationsOpen(false)
                  }}
                >
                  <span className="notification-kind reminder">
                    Business reminder
                  </span>
                  <strong>2 products need restocking</strong>
                  <p>
                    Cooking oil and Coca-Cola are at or below their low-stock
                    levels.
                  </p>
                  <small>Updated from sample inventory</small>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage("Resources")
                    setNotificationsOpen(false)
                  }}
                >
                  <span className="notification-kind application">
                    Application update
                  </span>
                  <strong>Mentorship application is still a draft</strong>
                  <p>Continue the sample application when you are ready.</p>
                  <small>Prototype status · Today</small>
                </button>
                <div>
                  <span className="notification-kind local">Local alert</span>
                  <strong>Demonstration: heavy rainfall advisory format</strong>
                  <p>
                    Heavy rainfall may affect deliveries and store access in
                    Quezon City. Check official local guidance before changing
                    business plans.
                  </p>
                  <small>
                    Sample source: PAGASA bulletin · Sample publication: Oct 22,
                    2026 · Quezon City · Not live
                  </small>
                </div>
                <div>
                  <span className="notification-kind reminder">
                    Tax reminder
                  </span>
                  <strong>Confirm your filing schedule</strong>
                  <p>
                    Check your registered tax type and current deadlines through
                    official BIR resources.
                  </p>
                  <small>Reminder only · No deadline calculated</small>
                </div>
              </div>
              <details className="notification-preferences">
                <summary>Notification preferences</summary>
                <p>
                  Prototype choices only. Scheduled monitoring and push delivery
                  require verified sources, backend services, and notification
                  permission.
                </p>
                {[
                  ["weather", "Severe weather and flooding"],
                  ["supply", "Supply disruptions"],
                  ["economic", "Economic and inflation updates"],
                  ["reminders", "Applications and document reminders"],
                  ["stock", "Low-stock alerts"],
                ].map(([key, label]) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={
                        notificationPreferences[
                          (key as keyof typeof notificationPreferences)
                        ]
                      }
                      onChange={(event) =>
                        setNotificationPreferences((current) => ({
                          ...current,
                          [key]: event.target.checked,
                        }))
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </details>
            </aside>
          </div>
        )}
        {headerMessage && (
          <div className="header-message" role="status">
            <span>{headerMessage}</span>
            <button
              type="button"
              onClick={() => setHeaderMessage("")}
              aria-label="Dismiss"
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      <Navigation currentPage={currentPage} onNavigate={navigate} />
    </div>
  )
}

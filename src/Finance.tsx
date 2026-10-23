import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { AddIcon, ArrowIcon, CloseIcon } from "./SectionIcons"

type Kind = "Income" | "Expense"
type Account = "Cash on hand" | "GCash"
type Transaction = {
  id: number
  name: string
  category: string
  date: string
  amount: number
  kind: Kind
  account: Account
  reference: string
  quantity?: number
  unit?: string
  unitPrice?: number
  timestamp?: string
  status?: "Recorded" | "Corrected" | "Voided"
  changes?: {
    timestamp: string
    action: string
    previousAmount: number
    newAmount: number
    reason: string
  }[]
}

const starterTransactions: Transaction[] = [
  {
    id: 1,
    name: "Coca-Cola Mismo",
    category: "Product sales",
    date: "October 22, 2026",
    amount: 264,
    kind: "Income",
    account: "Cash on hand",
    reference: "Product sale",
    quantity: 12,
    unit: "bottles",
    unitPrice: 22,
  },
  {
    id: 2,
    name: "Cooking oil 1L",
    category: "Inventory",
    date: "October 22, 2026",
    amount: 552,
    kind: "Expense",
    account: "GCash",
    reference: "Inventory purchase",
    quantity: 6,
    unit: "bottles",
    unitPrice: 92,
  },
  {
    id: 3,
    name: "Daily store sales",
    category: "Product sales",
    date: "October 21, 2026",
    amount: 10960,
    kind: "Income",
    account: "GCash",
    reference: "Sales summary · Cash and GCash",
  },
  {
    id: 4,
    name: "Meralco bill",
    category: "Utilities",
    date: "October 20, 2026",
    amount: 3180,
    kind: "Expense",
    account: "GCash",
    reference: "Monthly electric bill",
  },
  {
    id: 5,
    name: "Grab delivery fees",
    category: "Delivery",
    date: "March 19, 2026",
    amount: 740,
    kind: "Expense",
    account: "GCash",
    reference: "Weekly delivery charges",
  },
  {
    id: 6,
    name: "Store rent",
    category: "Rent",
    date: "September 18, 2025",
    amount: 12000,
    kind: "Expense",
    account: "Cash on hand",
    reference: "June 2025 rent",
  },
]

const bakeryTransactions: Transaction[] = [
  {
    ...starterTransactions[0],
    id: 21,
    name: "Chocolate Cake",
    amount: 900,
    quantity: 2,
    unit: "pieces",
    unitPrice: 450,
  },
  {
    ...starterTransactions[1],
    id: 22,
    name: "Flour, 5 kg",
    category: "Ingredients",
    amount: 560,
    quantity: 2,
    unit: "bags",
    unitPrice: 280,
  },
  ...starterTransactions.slice(2),
]

const chartData = [
  { label: "Oct 1", income: 14, expense: 9 },
  { label: "Oct 5", income: 18, expense: 12 },
  { label: "Oct 9", income: 16, expense: 8 },
  { label: "Oct 13", income: 23, expense: 17 },
  { label: "Oct 17", income: 20, expense: 10 },
  { label: "Oct 21", income: 27, expense: 14 },
]

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(value)
}

function transactionCode(id: number) {
  return `TXN-2026-${String(id).padStart(4, "0")}`
}

function FinanceModal({
  onClose,
  onSave,
  categories,
  onAddCategory,
  initialKind,
}: {
  onClose: () => void
  onSave: (transaction: Transaction) => void
  categories: Record<Kind, string[]>
  onAddCategory: (kind: Kind, category: string) => void
  initialKind: Kind
}) {
  const [kind, setKind] = useState<Kind>(initialKind)
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [entryMode, setEntryMode] =
    useState<"Direct amount" | "Quantity × price">("Direct amount")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("pieces")
  const [unitPrice, setUnitPrice] = useState("")
  const [date, setDate] = useState("2026-10-22")
  const [category, setCategory] = useState(categories[initialKind][0])
  const [account, setAccount] = useState<Account>("Cash on hand")
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [categoryError, setCategoryError] = useState("")

  function selectKind(value: Kind) {
    setKind(value)
    setCategory(categories[value][0])
    setAddingCategory(false)
    setCategoryError("")
  }

  function saveCategory() {
    const value = newCategory.trim()
    if (!value) {
      setCategoryError("Enter a category name.")
      return
    }
    onAddCategory(kind, value)
    setCategory(value)
    setAddingCategory(false)
    setNewCategory("")
    setCategoryError("")
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const total =
      entryMode === "Quantity × price"
        ? Number(quantity) * Number(unitPrice)
        : Number(amount)
    onSave({
      id: Date.now(),
      name,
      category,
      date: new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      amount: total,
      kind,
      account,
      reference: "Added in this prototype",
      quantity: entryMode === "Quantity × price" ? Number(quantity) : undefined,
      unit: entryMode === "Quantity × price" ? unit : undefined,
      unitPrice:
        entryMode === "Quantity × price" ? Number(unitPrice) : undefined,
      timestamp: new Date().toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      status: "Recorded",
      changes: [],
    })
  }

  return (
    <div className="section-modal-backdrop" onMouseDown={onClose}>
      <section
        className="section-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="section-modal-heading">
          <div>
            <h2 id="transaction-modal-title">Add transaction</h2>
            <p>Sample data only — this will not affect a real account.</p>
          </div>
          <button
            className="section-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={submit}>
          <div className="segmented-control" aria-label="Transaction type">
            {(["Income", "Expense"] as const).map((value) => (
              <button
                className={kind === value ? "is-active" : ""}
                type="button"
                onClick={() => selectKind(value)}
                key={value}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="section-field">
            <span>
              {kind === "Income"
                ? "Product or description"
                : "Item or description"}
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Daily store sales"
              required
            />
          </label>
          <div className="entry-mode-row">
            <span>How do you want to enter the total?</span>
            <div className="segmented-control">
              {(["Direct amount", "Quantity × price"] as const).map((value) => (
                <button
                  className={entryMode === value ? "is-active" : ""}
                  type="button"
                  onClick={() => setEntryMode(value)}
                  key={value}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          {entryMode === "Quantity × price" ? (
            <div className="itemized-fields">
              <label className="section-field">
                <span>Quantity</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </label>
              <label className="section-field">
                <span>Unit</span>
                <input
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  placeholder="e.g. pieces, bags, kg"
                  required
                />
              </label>
              <label className="section-field">
                <span>Unit price</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="any"
                  value={unitPrice}
                  onChange={(event) => setUnitPrice(event.target.value)}
                  required
                />
              </label>
              <div className="calculated-total">
                <span>Calculated total</span>
                <strong>
                  {peso(Number(quantity || 0) * Number(unitPrice || 0))}
                </strong>
              </div>
            </div>
          ) : (
            <label className="section-field">
              <span>Amount</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="₱0"
                required
              />
            </label>
          )}
          <div className="field-pair">
            <label className="section-field">
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label className="section-field">
              <span>Category</span>
              <select
                value={category}
                onChange={(event) => {
                  if (event.target.value === "__add__") {
                    setAddingCategory(true)
                    return
                  }
                  setCategory(event.target.value)
                  setAddingCategory(false)
                }}
              >
                {categories[kind].map((item) => (
                  <option key={item}>{item}</option>
                ))}
                <option value="__add__">+ Add category</option>
              </select>
            </label>
          </div>
          {addingCategory && (
            <div className="inline-category">
              <label className="section-field">
                <span>New category name</span>
                <input
                  value={newCategory}
                  onChange={(event) => {
                    setNewCategory(event.target.value)
                    setCategoryError("")
                  }}
                  placeholder="e.g. Packaging materials"
                  autoFocus
                />
              </label>
              {categoryError && <p className="field-error">{categoryError}</p>}
              <button
                className="secondary-button"
                type="button"
                onClick={saveCategory}
              >
                Save category
              </button>
            </div>
          )}
          <label className="section-field">
            <span>Payment method</span>
            <select
              value={account}
              onChange={(event) => setAccount(event.target.value as Account)}
            >
              <option value="Cash on hand">
                Cash on hand — physical money
              </option>
              <option value="GCash">GCash — wallet balance</option>
            </select>
          </label>
          <div className="section-modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Save transaction
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default function Finance({
  businessId,
  onViewInventory,
  requestedKind,
  onRequestHandled,
}: {
  businessId: string
  onViewInventory: () => void
  requestedKind: Kind | null
  onRequestHandled: () => void
}) {
  const [range, setRange] = useState("This month")
  const [filter, setFilter] = useState<"All" | Kind>("All")
  const [transactions, setTransactions] = useState(
    businessId === "lago-bakes" ? bakeryTransactions : starterTransactions,
  )
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalKind, setModalKind] = useState<Kind>("Income")
  const [notice, setNotice] = useState("")
  const [cashBalance, setCashBalance] = useState(
    businessId === "lago-bakes" ? 28750 : 52340,
  )
  const [gcashBalance, setGcashBalance] = useState(
    businessId === "lago-bakes" ? 18420 : 30000,
  )
  const [categories, setCategories] = useState<Record<Kind, string[]>>({
    Income: ["Product sales", "Delivery income", "Other income"],
    Expense: ["Inventory", "Utilities", "Rent", "Delivery"],
  })
  const [incomeTotal, setIncomeTotal] = useState(
    businessId === "lago-bakes" ? 84760 : 126450,
  )
  const [expenseTotal, setExpenseTotal] = useState(
    businessId === "lago-bakes" ? 53480 : 77800,
  )
  const [showTaxForm, setShowTaxForm] = useState(false)
  const [taxReminder, setTaxReminder] = useState("")
  const [taxDate, setTaxDate] = useState("")
  const [correctionMode, setCorrectionMode] =
    useState<"correct" | "void" | null>(null)
  const [correctedAmount, setCorrectedAmount] = useState("")
  const [correctionReason, setCorrectionReason] = useState("")
  const [transactionPeriod, setTransactionPeriod] = useState("Last 30 days")
  const [transactionView, setTransactionView] = useState<"Recent" | "Archived">(
    "Recent",
  )
  const [transactionQuery, setTransactionQuery] = useState("")
  const [transactionLimit, setTransactionLimit] = useState(6)
  const [transactionFrom, setTransactionFrom] = useState("")
  const [transactionTo, setTransactionTo] = useState("")
  const visibleTransactions = useMemo(() => {
    const anchor = new Date("2026-10-22T23:59:59").getTime()
    const maxAge =
      transactionPeriod === "Last 30 days"
        ? 30
        : transactionPeriod === "Last 6 months"
          ? 183
          : transactionPeriod === "Last 12 months"
            ? 365
            : Number.POSITIVE_INFINITY
    const matchesPeriod = (item: Transaction) => {
      const date = new Date(item.date).getTime()
      if (transactionPeriod === "All history") return true
      if (transactionPeriod === "Custom date range") {
        const from = transactionFrom ? new Date(transactionFrom).getTime() : 0
        const to = transactionTo
          ? new Date(`${transactionTo}T23:59:59`).getTime()
          : Number.POSITIVE_INFINITY
        return date >= from && date <= to
      }
      return (anchor - date) / 86400000 <= maxAge
    }
    return transactions.filter((item) => {
      const inPeriod = matchesPeriod(item)
      const inView = transactionView === "Recent" ? inPeriod : !inPeriod
      const matchesType = filter === "All" || item.kind === filter
      const matchesSearch =
        `${transactionCode(item.id)} ${item.name} ${item.category} ${item.account} ${item.date}`
          .toLowerCase()
          .includes(transactionQuery.toLowerCase())
      return inView && matchesType && matchesSearch
    })
  }, [
    filter,
    transactionFrom,
    transactionPeriod,
    transactionQuery,
    transactionTo,
    transactionView,
    transactions,
  ])
  const reportIncome =
    range === "This week"
      ? 32800
      : range === "Custom range"
        ? 88450
        : incomeTotal
  const savedReportTransactions = transactions.filter(
    (transaction) => transaction.status !== "Voided",
  )
  const reportTransactions =
    range === "This week"
      ? savedReportTransactions.slice(0, 3)
      : savedReportTransactions
  const recordedIncome = reportTransactions
    .filter((transaction) => transaction.kind === "Income")
    .reduce((total, transaction) => total + transaction.amount, 0)
  const recordedExpenses = reportTransactions
    .filter((transaction) => transaction.kind === "Expense")
    .reduce((total, transaction) => total + transaction.amount, 0)
  const categoryTotals = reportTransactions.reduce<Record<string, number>>(
    (totals, transaction) => ({
      ...totals,
      [transaction.category]:
        (totals[transaction.category] ?? 0) + transaction.amount,
    }),
    {},
  )

  useEffect(() => {
    if (!requestedKind) return
    setModalKind(requestedKind)
    setShowModal(true)
    onRequestHandled()
  }, [onRequestHandled, requestedKind])

  function exportReport() {
    const rows = [
      ["JMALago monthly business summary"],
      ["Period", range],
      ["Generated", new Date().toLocaleString("en-PH")],
      ["Recorded income", recordedIncome],
      ["Recorded expenses", recordedExpenses],
      ["Difference", recordedIncome - recordedExpenses],
      [],
      [
        "Transaction ID",
        "Date",
        "Type",
        "Description",
        "Category",
        "Payment method",
        "Amount",
        "Status",
      ],
      ...transactions.map((transaction) => [
        transactionCode(transaction.id),
        transaction.date,
        transaction.kind,
        transaction.name,
        transaction.category,
        transaction.account,
        transaction.amount,
        transaction.status ?? "Recorded",
      ]),
    ]
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "jmalago-monthly-summary.csv"
    link.click()
    URL.revokeObjectURL(url)
    setNotice("Monthly summary exported as CSV.")
  }

  function saveCorrection() {
    if (!selected || !correctionReason.trim()) return
    const nextAmount = correctionMode === "void" ? 0 : Number(correctedAmount)
    if (!Number.isFinite(nextAmount) || nextAmount < 0) return
    const change = {
      timestamp: new Date().toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      action: correctionMode === "void" ? "Voided" : "Amount corrected",
      previousAmount: selected.amount,
      newAmount: nextAmount,
      reason: correctionReason,
    }
    const updated: Transaction = {
      ...selected,
      amount: nextAmount,
      status: correctionMode === "void" ? "Voided" : "Corrected",
      changes: [change, ...(selected.changes ?? [])],
    }
    setTransactions((items) =>
      items.map((item) => (item.id === selected.id ? updated : item)),
    )
    const signedDifference =
      (nextAmount - selected.amount) * (selected.kind === "Income" ? 1 : -1)
    if (selected.account === "Cash on hand") {
      setCashBalance((current) => current + signedDifference)
    } else {
      setGcashBalance((current) => current + signedDifference)
    }
    if (selected.kind === "Income") {
      setIncomeTotal((current) => current + nextAmount - selected.amount)
    } else {
      setExpenseTotal((current) => current + nextAmount - selected.amount)
    }
    setSelected(updated)
    setCorrectionMode(null)
    setCorrectionReason("")
    setNotice(
      correctionMode === "void"
        ? "Transaction retained and marked as voided."
        : "Correction saved with its change history.",
    )
  }

  return (
    <main className="product-page finance-page">
      <header className="product-page-header">
        <div>
          <h1>Finance</h1>
        </div>
        <div className="page-actions">
          <select
            className="range-select"
            value={range}
            onChange={(event) => setRange(event.target.value)}
            aria-label="Date range"
          >
            <option>This month</option>
            <option>This week</option>
            <option>Custom range</option>
          </select>
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              setModalKind("Income")
              setShowModal(true)
            }}
          >
            <AddIcon />
            Add transaction
          </button>
        </div>
      </header>
      {range === "Custom range" && (
        <div className="custom-date-range">
          <label>
            <span>From</span>
            <input type="date" defaultValue="2026-10-01" />
          </label>
          <label>
            <span>To</span>
            <input type="date" defaultValue="2026-10-22" />
          </label>
        </div>
      )}

      {notice && (
        <div className="section-success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Dismiss
          </button>
        </div>
      )}

      <section className="finance-overview" aria-label="Financial overview">
        <div className="finance-primary">
          <span>Net income</span>
          <strong>{peso(incomeTotal - expenseTotal)}</strong>
          <small>Recorded income minus recorded expenses</small>
        </div>
        <div className="finance-metric income">
          <span>Total income</span>
          <strong>{peso(incomeTotal)}</strong>
          <small>+8.4% this month</small>
        </div>
        <div className="finance-metric expense">
          <span>Total expenses</span>
          <strong>{peso(expenseTotal)}</strong>
          <small>61.5% of income</small>
        </div>
        <div className="finance-metric">
          <span>Cash on Hand</span>
          <strong>{peso(cashBalance)}</strong>
          <small>Physical money in the business</small>
        </div>
        <div className="finance-metric account-gcash">
          <span>GCash Balance</span>
          <strong>{peso(gcashBalance)}</strong>
          <small>Funds in the GCash wallet</small>
        </div>
      </section>

      <div className="finance-layout">
        <div className="finance-main">
          <section className="content-panel chart-panel">
            <div className="panel-heading">
              <div>
                <h2>Income report</h2>
                <p>
                  {range} · total income {peso(reportIncome)}
                </p>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => setFilter("Income")}
              >
                View income transactions
              </button>
              <div className="chart-legend">
                <span className="legend-income">Income</span>
                <span className="legend-expense">Expenses</span>
              </div>
            </div>
            <div className="bar-chart" aria-label="Income and expenses chart">
              <div className="chart-grid">
                <span>₱30k</span>
                <span>₱20k</span>
                <span>₱10k</span>
                <span>₱0</span>
              </div>
              <div className="chart-columns">
                {chartData.map((item) => (
                  <div
                    className="chart-column"
                    key={item.label}
                    title={`${item.label}: ₱${item.income}k income, ₱${item.expense}k expenses`}
                  >
                    <div className="bar-pair">
                      <span
                        className="income-bar"
                        style={{ height: `${item.income * 3}px` }}
                      />
                      <span
                        className="expense-bar"
                        style={{ height: `${item.expense * 3}px` }}
                      />
                    </div>
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="transaction-section">
            <div className="panel-heading">
              <div>
                <h2>
                  {transactionView === "Recent"
                    ? "Recent transactions"
                    : "Archived Transactions"}
                </h2>
                <p>{visibleTransactions.length} entries</p>
              </div>
              <div className="compact-filters">
                {(["All", "Income", "Expense"] as const).map((value) => (
                  <button
                    className={filter === value ? "is-active" : ""}
                    type="button"
                    onClick={() => setFilter(value)}
                    key={value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="transaction-history-controls">
              <div className="history-view-tabs">
                <button
                  className={transactionView === "Recent" ? "is-active" : ""}
                  type="button"
                  onClick={() => {
                    setTransactionView("Recent")
                    setTransactionLimit(6)
                  }}
                >
                  Recent
                </button>
                <button
                  className={transactionView === "Archived" ? "is-active" : ""}
                  type="button"
                  onClick={() => {
                    setTransactionView("Archived")
                    setTransactionLimit(6)
                  }}
                >
                  Older Records
                </button>
              </div>
              <div className="transaction-filter-row">
                <select
                  value={transactionPeriod}
                  onChange={(event) => {
                    setTransactionPeriod(event.target.value)
                    setTransactionLimit(6)
                  }}
                  aria-label="Transaction history period"
                >
                  <option>Last 30 days</option>
                  <option>Last 6 months</option>
                  <option>Last 12 months</option>
                  <option>Custom date range</option>
                  <option>All history</option>
                </select>
                <input
                  type="search"
                  value={transactionQuery}
                  onChange={(event) => setTransactionQuery(event.target.value)}
                  placeholder="Search ID, description, or category"
                  aria-label="Search transaction history"
                />
              </div>
              {transactionPeriod === "Custom date range" && (
                <div className="history-custom-range">
                  <label>
                    <span>From</span>
                    <input
                      type="date"
                      value={transactionFrom}
                      onChange={(event) =>
                        setTransactionFrom(event.target.value)
                      }
                    />
                  </label>
                  <label>
                    <span>To</span>
                    <input
                      type="date"
                      value={transactionTo}
                      onChange={(event) => setTransactionTo(event.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="transaction-list">
              {visibleTransactions.slice(0, transactionLimit).map((item) => (
                <button
                  className="transaction-row"
                  type="button"
                  onClick={() => setSelected(item)}
                  key={item.id}
                >
                  <span
                    className={`transaction-mark ${item.kind.toLowerCase()}`}
                  >
                    {item.kind === "Income" ? "+" : "−"}
                  </span>
                  <span className="transaction-name">
                    <strong>{item.name}</strong>
                    <small>
                      {item.category} · {item.account} · {item.date}
                    </small>
                  </span>
                  <span
                    className={`transaction-amount ${item.kind.toLowerCase()}`}
                  >
                    {item.kind === "Income" ? "+" : "−"}
                    {peso(item.amount)}
                  </span>
                  <ArrowIcon />
                </button>
              ))}
              {!visibleTransactions.length && (
                <div className="history-empty">
                  <strong>No transactions found</strong>
                  <p>Try another period, type, or search.</p>
                </div>
              )}
            </div>
            {visibleTransactions.length > transactionLimit && (
              <button
                className="history-load-more"
                type="button"
                onClick={() => setTransactionLimit((value) => value + 6)}
              >
                Load more
              </button>
            )}
            <p className="archive-note">
              Archiving only changes what is shown here. Older records still
              keep their original details and remain included in matching
              reports.
            </p>
          </section>
        </div>

        <aside className="finance-aside">
          <section className="plain-section">
            <div className="panel-heading">
              <h2>Expense breakdown</h2>
              <span>₱77,800</span>
            </div>
            <div className="breakdown-list">
              {[
                ["Inventory", 52],
                ["Rent", 22],
                ["Utilities", 14],
                ["Delivery & other", 12],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>
                    <strong>{label}</strong>
                    <small>{value}%</small>
                  </span>
                  <i>
                    <b style={{ width: `${value}%` }} />
                  </i>
                </div>
              ))}
            </div>
          </section>
          <section className="plain-section">
            <div className="panel-heading">
              <h2>Upcoming payments</h2>
              <span>Next 7 days</span>
            </div>
            <div className="upcoming-list">
              <div>
                <span>
                  <strong>Store rent</strong>
                  <small>Due Jun 20</small>
                </span>
                <b>₱12,000</b>
              </div>
              <div>
                <span>
                  <strong>Internet bill</strong>
                  <small>Due Jun 23</small>
                </span>
                <b>₱1,699</b>
              </div>
            </div>
          </section>
          <section className="plain-section inventory-preview">
            <div className="panel-heading">
              <div>
                <h2>Inventory to review</h2>
                <p>Stock that may affect upcoming purchases</p>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={onViewInventory}
              >
                View all inventory
              </button>
            </div>
            <div className="preview-stock-list">
              {(businessId === "lago-bakes"
                ? [
                    ["Butter", "1.5 kg", "Low stock"],
                    ["Chocolate Cake 8-inch", "2 items", "Low stock"],
                    ["Cake boxes", "18 items", "In stock"],
                  ]
                : [
                    ["Cooking oil 1L", "3 bottles", "Low stock"],
                    ["Coca-Cola Mismo", "8 bottles", "Low stock"],
                    ["Premium rice", "18.5 kg", "In stock"],
                  ]
              ).map(([name, count, status]) => (
                <div key={name}>
                  <span>
                    <strong>{name}</strong>
                    <small>{count}</small>
                  </span>
                  <b className={status === "In stock" ? "ok" : ""}>{status}</b>
                </div>
              ))}
            </div>
            <p className="permission-note">
              Recording an inventory expense does not change stock
              automatically. Update inventory separately after receiving items.
            </p>
          </section>
          <section className="plain-section tax-section">
            <div className="panel-heading">
              <div>
                <h2>Tax reminders</h2>
                <p>Organization only — not tax filing or calculation</p>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => setShowTaxForm(!showTaxForm)}
              >
                {showTaxForm ? "Cancel" : "Add reminder"}
              </button>
            </div>
            {showTaxForm && (
              <form
                className="tax-reminder-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  setNotice("Tax reminder saved.")
                  setShowTaxForm(false)
                }}
              >
                <label className="section-field">
                  <span>Reminder</span>
                  <input
                    value={taxReminder}
                    onChange={(event) => setTaxReminder(event.target.value)}
                    placeholder="e.g. Confirm quarterly filing schedule"
                    required
                  />
                </label>
                <label className="section-field">
                  <span>Date you want to be reminded</span>
                  <input
                    type="date"
                    value={taxDate}
                    onChange={(event) => setTaxDate(event.target.value)}
                    required
                  />
                </label>
                <button className="primary-button" type="submit">
                  Save reminder
                </button>
              </form>
            )}
            <div className="tax-reminder-list">
              <div>
                <span>
                  <strong>Confirm registered filing schedule</strong>
                  <small>No official deadline stored</small>
                </span>
                <b>Needs review</b>
              </div>
              <div>
                <span>
                  <strong>BIR Certificate of Registration</strong>
                  <small>Stored in Documents</small>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Open Documents from the main navigation to review this file.",
                    )
                  }
                >
                  View document
                </button>
              </div>
            </div>
            <label className="tax-upload">
              <span>Add a tax-related document</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  event.target.files?.[0] &&
                  setNotice(
                    `${event.target.files[0].name} selected for this prototype.`,
                  )
                }
              />
            </label>
            <p className="permission-note">
              Check current rules and deadlines through official BIR channels.
              JMALago does not calculate tax due or submit filings.
            </p>
          </section>
        </aside>
      </div>

      <section className="finance-reports-section">
        <div className="panel-heading">
          <div>
            <h2>Reports</h2>
            <p>
              Monthly summary from the transactions currently saved in this
              prototype.
            </p>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={exportReport}
          >
            Export CSV
          </button>
        </div>
        <div className="report-summary">
          <div>
            <span>Recorded income</span>
            <strong>{peso(recordedIncome)}</strong>
            <button type="button" onClick={() => setFilter("Income")}>
              View transactions
            </button>
          </div>
          <div>
            <span>Recorded expenses</span>
            <strong>{peso(recordedExpenses)}</strong>
            <button type="button" onClick={() => setFilter("Expense")}>
              View transactions
            </button>
          </div>
          <div>
            <span>Income minus expenses</span>
            <strong>{peso(recordedIncome - recordedExpenses)}</strong>
            <small>Simple difference, not complete accounting profit.</small>
          </div>
          <div>
            <span>Transaction count</span>
            <strong>{reportTransactions.length}</strong>
            <small>Voided records are kept but excluded.</small>
          </div>
          <div>
            <span>Cash on hand</span>
            <strong>{peso(cashBalance)}</strong>
            <small>Where money is held, not additional income.</small>
          </div>
          <div>
            <span>GCash balance</span>
            <strong>{peso(gcashBalance)}</strong>
            <small>Shown separately from income.</small>
          </div>
        </div>
        <div className="report-breakdown">
          <h3>Category breakdown</h3>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div key={category}>
              <span>{category}</span>
              <strong>{peso(total)}</strong>
            </div>
          ))}
        </div>
        <p className="prototype-note">
          Period: {range}. Generated {new Date().toLocaleDateString("en-PH")}.
          This prototype report may be incomplete and is not an official tax,
          audit, government, or lender-certified document. Long-term retention
          requires secure backend storage, backups, and recovery controls.
        </p>
      </section>

      {selected && (
        <div
          className="section-modal-backdrop"
          onMouseDown={() => setSelected(null)}
        >
          <section
            className="section-modal detail-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="section-modal-heading">
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.reference}</p>
              </div>
              <button
                className="section-icon-button"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <dl className="record-facts">
              <div>
                <dt>Transaction ID</dt>
                <dd>{transactionCode(selected.id)}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{selected.kind}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{selected.category}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{selected.date}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{peso(selected.amount)}</dd>
              </div>
              {selected.quantity && (
                <>
                  <div>
                    <dt>Quantity</dt>
                    <dd>
                      {selected.quantity} {selected.unit}
                    </dd>
                  </div>
                  <div>
                    <dt>Unit price</dt>
                    <dd>{peso(selected.unitPrice ?? 0)}</dd>
                  </div>
                </>
              )}
              <div>
                <dt>Payment method</dt>
                <dd>{selected.account}</dd>
              </div>
              <div>
                <dt>Recorded</dt>
                <dd>{selected.timestamp ?? `${selected.date}, 9:00 AM`}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selected.status ?? "Recorded"}</dd>
              </div>
            </dl>
            {selected.quantity && (
              <>
                <p className="calculation-note">
                  {selected.quantity} {selected.unit} ×{" "}
                  {peso(selected.unitPrice ?? 0)} ={" "}
                  <strong>{peso(selected.amount)}</strong>
                </p>
                <p className="related-record-note">
                  Related stock movement: {transactionCode(selected.id)} · One
                  recorded deduction. Editing this financial record does not
                  deduct stock again.
                </p>
              </>
            )}
            <div className="transaction-correction-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setCorrectionMode("correct")
                  setCorrectedAmount(String(selected.amount))
                }}
              >
                Correct transaction
              </button>
              <button
                className="danger-text-button"
                type="button"
                onClick={() => {
                  setCorrectionMode("void")
                  setCorrectedAmount("0")
                }}
              >
                Void transaction
              </button>
            </div>
            {correctionMode && (
              <div className="transaction-correction-form">
                {correctionMode === "correct" && (
                  <label className="section-field">
                    <span>Corrected amount</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={correctedAmount}
                      onChange={(event) =>
                        setCorrectedAmount(event.target.value)
                      }
                    />
                  </label>
                )}
                <label className="section-field">
                  <span>
                    Reason for{" "}
                    {correctionMode === "void" ? "voiding" : "correction"}
                  </span>
                  <input
                    value={correctionReason}
                    onChange={(event) =>
                      setCorrectionReason(event.target.value)
                    }
                    placeholder="Explain what needed to change"
                  />
                </label>
                <p>
                  Original amount: {peso(selected.amount)}. The original record
                  will remain in the change history.
                </p>
                <button
                  className="primary-button"
                  type="button"
                  disabled={!correctionReason.trim()}
                  onClick={saveCorrection}
                >
                  Confirm {correctionMode === "void" ? "void" : "correction"}
                </button>
              </div>
            )}
            {(selected.changes?.length ?? 0) > 0 && (
              <section className="transaction-change-history">
                <h3>Change history</h3>
                {selected.changes?.map((change) => (
                  <div key={change.timestamp}>
                    <span>
                      <strong>{change.action}</strong>
                      <small>{change.timestamp}</small>
                    </span>
                    <p>
                      {peso(change.previousAmount)} → {peso(change.newAmount)} ·{" "}
                      {change.reason}
                    </p>
                  </div>
                ))}
              </section>
            )}
            <p className="prototype-note">
              This is sample transaction data for the prototype.
            </p>
          </section>
        </div>
      )}
      {showModal && (
        <FinanceModal
          onClose={() => setShowModal(false)}
          categories={categories}
          initialKind={modalKind}
          onAddCategory={(kind, newCategory) =>
            setCategories((current) => ({
              ...current,
              [kind]: current[kind].includes(newCategory)
                ? current[kind]
                : [...current[kind], newCategory],
            }))
          }
          onSave={(item) => {
            setTransactions((current) => [item, ...current])
            const change = item.kind === "Income" ? item.amount : -item.amount
            if (item.account === "Cash on hand") {
              setCashBalance((current) => current + change)
            } else {
              setGcashBalance((current) => current + change)
            }
            if (item.kind === "Income") {
              setIncomeTotal((current) => current + item.amount)
            } else {
              setExpenseTotal((current) => current + item.amount)
            }
            setShowModal(false)
            setNotice(`${item.kind} saved to ${item.account}.`)
          }}
        />
      )}
    </main>
  )
}

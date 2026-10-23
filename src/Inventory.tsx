import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  AddIcon,
  ArrowIcon,
  BoxIcon,
  CloseIcon,
  SearchIcon,
} from "./SectionIcons"

type Product = {
  id: number
  name: string
  category: string
  stock: number
  unit: string
  price: number
  cost?: number
  reorder: number
}

type StockEvent = {
  id: number
  productId: number
  timestamp: string
  previous: number
  change: number
  result: number
  reason: string
  related?: string
  ageDays: number
  recordedDate?: string
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Cooking oil 1L",
    category: "Pantry",
    stock: 3,
    unit: "bottles",
    price: 115,
    cost: 92,
    reorder: 6,
  },
  {
    id: 2,
    name: "Lucky Me Pancit Canton",
    category: "Instant noodles",
    stock: 24,
    unit: "packs",
    price: 18,
    cost: 14,
    reorder: 12,
  },
  {
    id: 3,
    name: "Coca-Cola Mismo",
    category: "Beverages",
    stock: 8,
    unit: "bottles",
    price: 22,
    cost: 17,
    reorder: 10,
  },
  {
    id: 4,
    name: "Bear Brand sachet",
    category: "Milk",
    stock: 32,
    unit: "sachets",
    price: 14,
    cost: 11,
    reorder: 15,
  },
  {
    id: 5,
    name: "Premium rice",
    category: "Rice",
    stock: 18.5,
    unit: "kg",
    price: 58,
    cost: 49,
    reorder: 10,
  },
]

const bakeryProducts: Product[] = [
  {
    id: 21,
    name: "All-purpose flour",
    category: "Ingredients",
    stock: 8.5,
    unit: "kg",
    price: 0,
    cost: 56,
    reorder: 5,
  },
  {
    id: 22,
    name: "Chocolate Cake 8-inch",
    category: "Finished products",
    stock: 2,
    unit: "items",
    price: 900,
    cost: 480,
    reorder: 2,
  },
  {
    id: 23,
    name: "Butter",
    category: "Ingredients",
    stock: 1.5,
    unit: "kg",
    price: 0,
    cost: 420,
    reorder: 2,
  },
  {
    id: 24,
    name: "Cake boxes",
    category: "Packaging",
    stock: 18,
    unit: "items",
    price: 0,
    cost: 22,
    reorder: 10,
  },
]

function createInitialHistory(
  product: Product,
  businessId: string,
): StockEvent[] {
  const hasSale =
    (businessId === "sari-sari" && product.id === 3) ||
    (businessId === "lago-bakes" && product.id === 22)
  const saleChange = businessId === "lago-bakes" ? -2 : -12
  const quantityBeforeSale = hasSale
    ? product.stock - saleChange
    : product.stock
  const restockAmount = hasSale
    ? businessId === "lago-bakes"
      ? 2
      : 5
    : Math.min(5, quantityBeforeSale)
  const openingQuantity = Math.max(0, quantityBeforeSale - restockAmount)

  return [
    ...(hasSale
      ? [
          {
            id: product.id * 100 + 3,
            productId: product.id,
            timestamp: "Oct 22, 2026, 3:18 PM",
            previous: quantityBeforeSale,
            change: saleChange,
            result: product.stock,
            reason: "Sale",
            related:
              businessId === "lago-bakes" ? "TXN-2026-0021" : "TXN-2026-0001",
            ageDays: 5,
          },
        ]
      : []),
    {
      id: product.id * 100 + 2,
      productId: product.id,
      timestamp: "Sep 2, 2026, 10:15 AM",
      previous: openingQuantity,
      change: restockAmount,
      result: quantityBeforeSale,
      reason: "Restock",
      ageDays: 50,
    },
    {
      id: product.id * 100,
      productId: product.id,
      timestamp: "Sep 17, 2025, 9:00 AM",
      previous: 0,
      change: openingQuantity,
      result: openingQuantity,
      reason: "Opening stock count",
      ageDays: 400,
    },
  ]
}

function StockHistoryEntry({
  event,
  product,
}: {
  event: StockEvent
  product: Product
}) {
  return (
    <article>
      <div>
        <strong>
          {product.name} · {event.reason}
        </strong>
        <time>{event.timestamp}</time>
      </div>
      <dl>
        <div>
          <dt>Previous</dt>
          <dd>
            {event.previous} {product.unit}
          </dd>
        </div>
        <div>
          <dt>Change</dt>
          <dd className={event.change < 0 ? "negative" : "positive"}>
            {event.change > 0 ? "+" : ""}
            {event.change} {product.unit}
          </dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd>
            {event.result} {product.unit}
          </dd>
        </div>
      </dl>
      <p className="movement-id">Stock record STK-{event.id}</p>
      {event.related && <p>Related transaction: {event.related}</p>}
    </article>
  )
}

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(value)
}

function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product?: Product
  onClose: () => void
  onSave: (product: Product) => void
}) {
  const [name, setName] = useState(product?.name ?? "")
  const [category, setCategory] = useState(product?.category ?? "")
  const [stock, setStock] = useState(String(product?.stock ?? 0))
  const [unit, setUnit] = useState(product?.unit ?? "items")
  const [price, setPrice] = useState(String(product?.price ?? ""))
  const [cost, setCost] = useState(String(product?.cost ?? ""))
  const [reorder, setReorder] = useState(String(product?.reorder ?? 5))

  function submit(event: FormEvent) {
    event.preventDefault()
    onSave({
      id: product?.id ?? Date.now(),
      name,
      category: category || "Other",
      stock: Number(stock),
      unit,
      price: Number(price),
      cost: cost ? Number(cost) : undefined,
      reorder: Number(reorder),
    })
  }

  return (
    <div className="section-modal-backdrop" onMouseDown={onClose}>
      <section
        className="section-modal inventory-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="section-modal-heading">
          <div>
            <h2 id="product-form-title">
              {product ? "Edit product" : "Add product"}
            </h2>
            <p>Product changes are saved in this prototype only.</p>
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
          <label className="section-field">
            <span>Product name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Cooking oil 1L"
              required
            />
          </label>
          <label className="section-field">
            <span>Product image (optional)</span>
            <input type="file" accept="image/*" />
            <small>Shown only as a local prototype selection.</small>
          </label>
          <div className="field-pair">
            <label className="section-field">
              <span>Category</span>
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Beverages"
              />
            </label>
            <label className="section-field">
              <span>Unit</span>
              <select
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
              >
                <option>items</option>
                <option>packs</option>
                <option>bottles</option>
                <option>sachets</option>
                <option>kg</option>
                <option>liters</option>
              </select>
            </label>
          </div>
          <div className="field-pair">
            <label className="section-field">
              <span>Exact stock quantity</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
              />
            </label>
            <label className="section-field">
              <span>Low-stock level</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={reorder}
                onChange={(event) => setReorder(event.target.value)}
                required
              />
            </label>
          </div>
          <div className="field-pair">
            <label className="section-field">
              <span>Selling price</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </label>
            <label className="section-field">
              <span>Cost per unit (optional)</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={cost}
                onChange={(event) => setCost(event.target.value)}
              />
            </label>
          </div>
          <div className="section-modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Save product
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ProductDetail({
  product,
  history,
  onBack,
  onSave,
}: {
  product: Product
  history: StockEvent[]
  onBack: () => void
  onSave: (product: Product, movement?: StockEvent) => void
}) {
  const [editing, setEditing] = useState(false)
  const [stock, setStock] = useState(String(product.stock))
  const [price, setPrice] = useState(String(product.price))
  const [cost, setCost] = useState(
    product.cost == null ? "" : String(product.cost),
  )
  const [error, setError] = useState("")
  const [saved, setSaved] = useState("")
  const [reason, setReason] = useState("Stock count correction")
  const [movementDate, setMovementDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [showHistory, setShowHistory] = useState(false)
  const [historyPeriod, setHistoryPeriod] = useState("Last 30 days")
  const [historyView, setHistoryView] = useState<"Recent" | "Archived">(
    "Recent",
  )
  const [historyQuery, setHistoryQuery] = useState("")
  const [historyReason, setHistoryReason] = useState("All reasons")
  const [historyLimit, setHistoryLimit] = useState(5)
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const quantity = Number(stock)
  const sellingPrice = Number(price)
  const buyingPrice = cost === "" ? undefined : Number(cost)
  const low = quantity <= product.reorder

  function save() {
    if (
      !Number.isFinite(quantity) ||
      quantity < 0 ||
      !Number.isFinite(sellingPrice) ||
      sellingPrice < 0 ||
      (buyingPrice !== undefined &&
        (!Number.isFinite(buyingPrice) || buyingPrice < 0))
    ) {
      setError("Enter valid amounts that are zero or higher.")
      return
    }
    const updatedProduct = {
      ...product,
      stock: quantity,
      price: sellingPrice,
      cost: buyingPrice,
    }
    const movement =
      quantity === product.stock
        ? undefined
        : {
            id: Date.now(),
            productId: product.id,
            timestamp: new Date(
              `${movementDate}T${new Date().toTimeString().slice(0, 8)}`,
            ).toLocaleString("en-PH", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            previous: product.stock,
            change: quantity - product.stock,
            result: quantity,
            reason,
            ageDays: 0,
            recordedDate: movementDate,
          }
    onSave(updatedProduct, movement)
    setEditing(false)
    setError("")
    setSaved("Quantity and pricing saved.")
  }

  return (
    <main className="product-page inventory-detail-page">
      <button className="back-button" type="button" onClick={onBack}>
        ‹ Back to Inventory
      </button>
      <header className="inventory-detail-heading">
        <span className="product-image-placeholder">
          <BoxIcon />
        </span>
        <div>
          <p>{product.category}</p>
          <h1>{product.name}</h1>
          <span className={`stock-label visible ${low ? "is-low" : ""}`}>
            {low ? "Low stock" : "In stock"}
          </span>
        </div>
      </header>

      {error && (
        <div className="section-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}
      {saved && (
        <div className="section-success" role="status">
          <span>{saved}</span>
          <button type="button" onClick={() => setSaved("")}>
            Dismiss
          </button>
        </div>
      )}

      <div className="inventory-detail-grid">
        <section className="inventory-detail-primary">
          <div className="detail-section-heading">
            <div>
              <h2>Stock information</h2>
              <p>Current count for this product</p>
            </div>
            <button
              className={editing ? "secondary-button" : "primary-button"}
              type="button"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel editing" : "Edit quantity and pricing"}
            </button>
          </div>
          <div className="stock-quantity-display">
            <strong>
              {quantity} <small>{product.unit}</small>
            </strong>
            <span>Current stock quantity</span>
          </div>

          {editing && (
            <div className="inventory-detail-form">
              <label className="section-field">
                <span>Exact stock quantity</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                />
              </label>
              <label className="section-field">
                <span>Reason for stock change</span>
                <select
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                >
                  <option>Restock</option>
                  <option>Sale</option>
                  <option>Damaged or lost items</option>
                  <option>Stock count correction</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="section-field">
                <span>Date</span>
                <input
                  type="date"
                  value={movementDate}
                  onChange={(event) => setMovementDate(event.target.value)}
                  required
                />
              </label>
              <label className="section-field">
                <span>
                  Buying price per {product.unit.slice(0, -1) || product.unit}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={cost}
                  placeholder="Leave blank if unknown"
                  onChange={(event) => setCost(event.target.value)}
                />
              </label>
              <label className="section-field">
                <span>
                  Selling price per {product.unit.slice(0, -1) || product.unit}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
              <button className="primary-button" type="button" onClick={save}>
                Save changes
              </button>
              {quantity !== product.stock && Number.isFinite(quantity) && (
                <div className="stock-change-preview">
                  <span>
                    Previous stock{" "}
                    <strong>
                      {product.stock} {product.unit}
                    </strong>
                  </span>
                  <span>
                    Change{" "}
                    <strong>
                      {quantity - product.stock > 0 ? "+" : ""}
                      {quantity - product.stock} {product.unit}
                    </strong>
                  </span>
                  <span>
                    New stock{" "}
                    <strong>
                      {quantity} {product.unit}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="pricing-details">
            <div>
              <span>Buying price per unit</span>
              <strong>
                {buyingPrice === undefined ? "Not provided" : peso(buyingPrice)}
              </strong>
            </div>
            <div>
              <span>Selling price per unit</span>
              <strong>{peso(sellingPrice)}</strong>
            </div>
          </div>
        </section>

        <aside className="stock-values">
          <div className="panel-heading">
            <div>
              <h2>Calculated stock values</h2>
              <p>Estimates based on the current quantity</p>
            </div>
          </div>
          {buyingPrice !== undefined && (
            <div>
              <span>Stock Cost Value</span>
              <strong>{peso(quantity * buyingPrice)}</strong>
              <p>Estimated purchase cost of the remaining stock.</p>
            </div>
          )}
          <div>
            <span>Potential Sales Value</span>
            <strong>{peso(quantity * sellingPrice)}</strong>
            <p>
              Possible revenue if all current stock sells at the listed price.
            </p>
          </div>
          <p className="permission-note">
            These estimates are not actual profit or cash already earned.
            Inventory changes do not create Finance transactions.
          </p>
        </aside>
      </div>
      <section
        className={`stock-history-section${showHistory ? " is-open" : ""}`}
      >
        <div className="stock-history-toggle-row">
          <div>
            <h2>Stock History</h2>
            <p>{history.length} saved stock changes</p>
          </div>
          <button
            className="secondary-button"
            type="button"
            aria-expanded={showHistory}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? "Hide Stock History" : "View Stock History"}
          </button>
        </div>
        {showHistory &&
          (() => {
            const maxAge =
              historyPeriod === "Last 30 days"
                ? 30
                : historyPeriod === "Last 6 months"
                  ? 183
                  : historyPeriod === "Last 12 months"
                    ? 365
                    : Number.POSITIVE_INFINITY
            const matchesPeriod = (event: StockEvent) => {
              if (historyPeriod === "All history") return true
              if (historyPeriod === "Custom date range") {
                const date = new Date(event.timestamp).getTime()
                const from = customFrom ? new Date(customFrom).getTime() : 0
                const to = customTo
                  ? new Date(`${customTo}T23:59:59`).getTime()
                  : Number.POSITIVE_INFINITY
                return date >= from && date <= to
              }
              return event.ageDays <= maxAge
            }
            const source =
              historyView === "Recent"
                ? history.filter(matchesPeriod)
                : history.filter((event) => !matchesPeriod(event))
            const filtered = source.filter(
              (event) =>
                (historyReason === "All reasons" ||
                  event.reason === historyReason) &&
                `${event.reason} ${event.timestamp} ${event.related ?? ""}`
                  .toLowerCase()
                  .includes(historyQuery.toLowerCase()),
            )
            return (
              <>
                <div className="history-view-tabs">
                  <button
                    className={historyView === "Recent" ? "is-active" : ""}
                    type="button"
                    onClick={() => {
                      setHistoryView("Recent")
                      setHistoryLimit(5)
                    }}
                  >
                    Recent records
                  </button>
                  <button
                    className={historyView === "Archived" ? "is-active" : ""}
                    type="button"
                    onClick={() => {
                      setHistoryView("Archived")
                      setHistoryLimit(5)
                    }}
                  >
                    Older Records
                  </button>
                </div>
                <div className="history-filter-bar">
                  <select
                    value={historyPeriod}
                    onChange={(event) => {
                      setHistoryPeriod(event.target.value)
                      setHistoryLimit(5)
                    }}
                    aria-label="Stock history period"
                  >
                    <option>Last 30 days</option>
                    <option>Last 6 months</option>
                    <option>Last 12 months</option>
                    <option>Custom date range</option>
                    <option>All history</option>
                  </select>
                  <select
                    value={historyReason}
                    onChange={(event) => setHistoryReason(event.target.value)}
                    aria-label="Stock change reason"
                  >
                    <option>All reasons</option>
                    <option>Restock</option>
                    <option>Sale</option>
                    <option>Damaged or lost items</option>
                    <option>Stock count correction</option>
                    <option>Opening stock count</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="search"
                    value={historyQuery}
                    onChange={(event) => setHistoryQuery(event.target.value)}
                    placeholder="Search date, reason, or reference"
                    aria-label="Search stock history"
                  />
                </div>
                {historyPeriod === "Custom date range" && (
                  <div className="history-custom-range">
                    <label>
                      <span>From</span>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(event) => setCustomFrom(event.target.value)}
                      />
                    </label>
                    <label>
                      <span>To</span>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(event) => setCustomTo(event.target.value)}
                      />
                    </label>
                  </div>
                )}
                <div className="stock-history-list">
                  {filtered.slice(0, historyLimit).map((event) => (
                    <StockHistoryEntry
                      event={event}
                      product={product}
                      key={event.id}
                    />
                  ))}
                  {!filtered.length && (
                    <div className="history-empty">
                      <strong>No stock changes found</strong>
                      <p>Try another time period, reason, or search.</p>
                    </div>
                  )}
                  {filtered.length > historyLimit && (
                    <button
                      className="history-load-more"
                      type="button"
                      onClick={() => setHistoryLimit((value) => value + 5)}
                    >
                      Load more
                    </button>
                  )}
                </div>
                <p className="prototype-note">
                  Prototype history is kept only for this session. Production
                  record retention requires secure persistent storage, backups,
                  recovery, and access controls.
                </p>
              </>
            )
          })()}
      </section>
    </main>
  )
}

function GeneralStockHistory({
  products,
  events,
  onBack,
}: {
  products: Product[]
  events: StockEvent[]
  onBack: () => void
}) {
  const [period, setPeriod] = useState("Last 30 days")
  const [view, setView] = useState<"Recent" | "Archived">("Recent")
  const [productId, setProductId] = useState("All products")
  const [reason, setReason] = useState("All reasons")
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(8)
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const productMap = Object.fromEntries(
    products.map((product) => [product.id, product]),
  )
  const maxAge =
    period === "Last 30 days"
      ? 30
      : period === "Last 6 months"
        ? 183
        : period === "Last 12 months"
          ? 365
          : Number.POSITIVE_INFINITY
  const matchesPeriod = (event: StockEvent) => {
    if (period === "All history") return true
    if (period === "Custom date range") {
      const date = new Date(event.timestamp).getTime()
      const start = from ? new Date(from).getTime() : 0
      const end = to
        ? new Date(`${to}T23:59:59`).getTime()
        : Number.POSITIVE_INFINITY
      return date >= start && date <= end
    }
    return event.ageDays <= maxAge
  }
  const filtered = events
    .filter((event) =>
      view === "Recent" ? matchesPeriod(event) : !matchesPeriod(event),
    )
    .filter(
      (event) =>
        (productId === "All products" ||
          event.productId === Number(productId)) &&
        (reason === "All reasons" || event.reason === reason) &&
        `${productMap[event.productId]?.name ?? ""} ${event.reason} ${event.timestamp} ${event.related ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => a.ageDays - b.ageDays)
  const filtersActive =
    period !== "Last 30 days" ||
    productId !== "All products" ||
    reason !== "All reasons" ||
    query !== ""

  function clearFilters() {
    setPeriod("Last 30 days")
    setProductId("All products")
    setReason("All reasons")
    setQuery("")
    setFrom("")
    setTo("")
    setLimit(8)
  }

  return (
    <main className="product-page general-history-page">
      <button className="back-button" type="button" onClick={onBack}>
        ‹ Back to Inventory
      </button>
      <header className="product-page-header">
        <div>
          <h1>Stock History</h1>
          <p>Stock changes across all products</p>
        </div>
        {filtersActive && (
          <button className="text-button" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </header>
      <div className="history-view-tabs">
        <button
          className={view === "Recent" ? "is-active" : ""}
          type="button"
          onClick={() => {
            setView("Recent")
            setLimit(8)
          }}
        >
          Recent records
        </button>
        <button
          className={view === "Archived" ? "is-active" : ""}
          type="button"
          onClick={() => {
            setView("Archived")
            setLimit(8)
          }}
        >
          Older Records
        </button>
      </div>
      <div className="general-history-filters">
        <select
          value={period}
          onChange={(event) => {
            setPeriod(event.target.value)
            setLimit(8)
          }}
          aria-label="History period"
        >
          <option>Last 30 days</option>
          <option>Last 6 months</option>
          <option>Last 12 months</option>
          <option>Custom date range</option>
          <option>All history</option>
        </select>
        <select
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
          aria-label="Product"
        >
          <option>All products</option>
          {products.map((product) => (
            <option value={product.id} key={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <select
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          aria-label="Change reason"
        >
          <option>All reasons</option>
          <option>Restock</option>
          <option>Sale</option>
          <option>Damaged or lost items</option>
          <option>Stock count correction</option>
          <option>Opening stock count</option>
          <option>Other</option>
        </select>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search product, date, or reference"
          aria-label="Search all stock history"
        />
      </div>
      {period === "Custom date range" && (
        <div className="history-custom-range">
          <label>
            <span>From</span>
            <input
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </label>
        </div>
      )}
      <div className="stock-history-list general-history-list">
        {filtered.slice(0, limit).map((event) => (
          <StockHistoryEntry
            event={event}
            product={productMap[event.productId]}
            key={event.id}
          />
        ))}
        {!filtered.length && (
          <div className="history-empty">
            <strong>No stock changes found for this period</strong>
            <p>Try another product, reason, or time period.</p>
          </div>
        )}
      </div>
      {filtered.length > limit && (
        <button
          className="history-load-more"
          type="button"
          onClick={() => setLimit((value) => value + 8)}
        >
          Load more
        </button>
      )}
      <p className="prototype-note">
        Both this timeline and each product’s history use the same session-only
        movement records. Filters never change stock quantities.
      </p>
    </main>
  )
}

export default function Inventory({ businessId }: { businessId: string }) {
  const [products, setProducts] = useState(
    businessId === "lago-bakes" ? bakeryProducts : sampleProducts,
  )
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"All" | "Low stock">("All")
  const [editing, setEditing] = useState<"new" | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [showGeneralHistory, setShowGeneralHistory] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [histories, setHistories] = useState<Record<number, StockEvent[]>>(() =>
    Object.fromEntries(
      (businessId === "lago-bakes" ? bakeryProducts : sampleProducts).map(
        (product) => [product.id, createInitialHistory(product, businessId)],
      ),
    ),
  )
  const visible = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "All" || product.stock <= product.reorder),
      ),
    [filter, products, query],
  )

  if (showGeneralHistory) {
    return (
      <GeneralStockHistory
        products={products}
        events={Object.values(histories).flat()}
        onBack={() => setShowGeneralHistory(false)}
      />
    )
  }

  if (selected) {
    return (
      <ProductDetail
        product={selected}
        history={histories[selected.id] ?? []}
        onBack={() => setSelected(null)}
        onSave={(product, movement) => {
          setProducts((items) =>
            items.map((item) => (item.id === product.id ? product : item)),
          )
          setSelected(product)
          setNotice(`${product.name} details saved.`)
          if (movement) {
            setHistories((current) => ({
              ...current,
              [product.id]: [movement, ...(current[product.id] ?? [])],
            }))
          }
        }}
      />
    )
  }

  return (
    <main className="product-page inventory-page">
      <header className="product-page-header">
        <div>
          <h1>Inventory</h1>
          <p>Products and stock levels</p>
        </div>
        <div className="page-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setShowGeneralHistory(true)}
          >
            Stock History
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setEditing("new")}
          >
            <AddIcon />
            Add product
          </button>
        </div>
      </header>
      {notice && (
        <div className="section-success" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            Dismiss
          </button>
        </div>
      )}
      {error && (
        <div className="section-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}
      <div className="inventory-page-toolbar">
        <label className="section-search">
          <SearchIcon />
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
          />
        </label>
        <div className="compact-filters">
          {(["All", "Low stock"] as const).map((value) => (
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
      <div className="inventory-management-list">
        {visible.map((product) => {
          const low = product.stock <= product.reorder
          return (
            <button
              className="inventory-product"
              type="button"
              onClick={() => setSelected(product)}
              key={product.id}
            >
              <span className="product-image-placeholder">
                <BoxIcon />
              </span>
              <div className="inventory-product-main">
                <div>
                  <strong>{product.name}</strong>
                  <small>
                    {product.stock} {product.unit} · {peso(product.price)} per
                    unit
                  </small>
                </div>
                <span className={`stock-label visible ${low ? "is-low" : ""}`}>
                  {low ? "Low stock" : "In stock"}
                </span>
              </div>
              <ArrowIcon className="inventory-row-arrow" />
            </button>
          )
        })}
        {!visible.length && (
          <div className="inventory-empty">
            <strong>No products found</strong>
            <p>Clear the search or add a new product.</p>
            <button
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
      {editing && (
        <ProductForm
          product={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={(product) => {
            const isNew = !products.some((item) => item.id === product.id)
            setProducts((items) =>
              items.some((item) => item.id === product.id)
                ? items.map((item) => (item.id === product.id ? product : item))
                : [product, ...items],
            )
            if (isNew) {
              setHistories((current) => ({
                ...current,
                [product.id]: [
                  {
                    id: Date.now(),
                    productId: product.id,
                    timestamp: new Date().toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                    previous: 0,
                    change: product.stock,
                    result: product.stock,
                    reason: "Opening stock count",
                    ageDays: 0,
                  },
                ],
              }))
            }
            setEditing(null)
            setNotice(`${product.name} saved.`)
          }}
        />
      )}
    </main>
  )
}

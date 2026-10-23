import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  AddIcon,
  ArrowIcon,
  BoxIcon,
  CheckIcon,
  CloseIcon,
  SearchIcon,
} from "./SectionIcons"

type TaskStatus = "Pending" | "In progress" | "Completed" | "Needs attention"
type Task = {
  id: number
  name: string
  due: string
  status: TaskStatus
  detail: string
}
type Product = {
  id: number
  name: string
  category: string
  stock: number
  unit: string
  reorder: number
}

const starterTasks: Task[] = [
  {
    id: 1,
    name: "Receive Golden Sun delivery",
    due: "Today, 2:00 PM",
    status: "In progress",
    detail: "Check quantities against purchase order PO-184.",
  },
  {
    id: 2,
    name: "Reorder cooking oil",
    due: "Today",
    status: "Needs attention",
    detail: "Stock is below the 6-bottle reorder level.",
  },
  {
    id: 3,
    name: "Prepare weekend price labels",
    due: "Tomorrow",
    status: "Pending",
    detail: "Print and place updated shelf labels before opening.",
  },
  {
    id: 4,
    name: "Clean beverage cooler",
    due: "Completed today",
    status: "Completed",
    detail: "Weekly cooler cleaning completed by Ana.",
  },
]

const starterProducts: Product[] = [
  {
    id: 1,
    name: "Cooking oil 1L",
    category: "Pantry",
    stock: 3,
    unit: "bottles",
    reorder: 6,
  },
  {
    id: 2,
    name: "Lucky Me Pancit Canton",
    category: "Instant noodles",
    stock: 24,
    unit: "packs",
    reorder: 12,
  },
  {
    id: 3,
    name: "Coca-Cola Mismo",
    category: "Beverages",
    stock: 8,
    unit: "bottles",
    reorder: 10,
  },
  {
    id: 4,
    name: "Bear Brand sachet",
    category: "Milk",
    stock: 32,
    unit: "sachets",
    reorder: 15,
  },
  {
    id: 5,
    name: "SkyFlakes crackers",
    category: "Snacks",
    stock: 18,
    unit: "packs",
    reorder: 10,
  },
]

function OperationsModal({
  mode,
  onClose,
  onAddTask,
  onAddProduct,
}: {
  mode: "task" | "product"
  onClose: () => void
  onAddTask: (name: string) => void
  onAddProduct: (name: string, stock: number, unit: string) => void
}) {
  const [name, setName] = useState("")
  const [stock, setStock] = useState("1")
  const [unit, setUnit] = useState("items")
  function submit(event: FormEvent) {
    event.preventDefault()
    mode === "task" ? onAddTask(name) : onAddProduct(name, Number(stock), unit)
  }
  return (
    <div className="section-modal-backdrop" onMouseDown={onClose}>
      <section
        className="section-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="operations-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="section-modal-heading">
          <div>
            <h2 id="operations-modal-title">
              {mode === "task" ? "Create task" : "Add product"}
            </h2>
            <p>Saved in this prototype only.</p>
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
            <span>{mode === "task" ? "Task name" : "Product name"}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={
                mode === "task"
                  ? "e.g. Check supplier delivery"
                  : "e.g. Sardines 155g"
              }
              required
            />
          </label>
          {mode === "product" && (
            <div className="field-pair">
              <label className="section-field">
                <span>Initial stock quantity</span>
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
                <span>Unit</span>
                <select
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                >
                  <option value="items">Items</option>
                  <option value="packs">Packs</option>
                  <option value="bottles">Bottles</option>
                  <option value="kg">Kilograms</option>
                  <option value="liters">Liters</option>
                </select>
              </label>
            </div>
          )}
          <div className="section-modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="primary-button" type="submit">
              {mode === "task" ? "Create task" : "Add product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default function Operations() {
  const [tab, setTab] = useState<"Tasks" | "Inventory">("Tasks")
  const [tasks, setTasks] = useState(starterTasks)
  const [products, setProducts] = useState(starterProducts)
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState<"task" | "product" | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [notice, setNotice] = useState("")
  const [stockError, setStockError] = useState("")
  const [stockDrafts, setStockDrafts] = useState<Record<number, string>>({})
  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  )
  const lowStock = products.filter(
    (product) => product.stock <= product.reorder,
  ).length

  function updateTask(id: number, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task)),
    )
    setNotice(
      status === "Completed"
        ? "Task marked as complete."
        : `Task status changed to ${status.toLowerCase()}.`,
    )
  }
  function adjustStock(id: number, amount: number) {
    const product = products.find((item) => item.id === id)
    if (!product) return
    const currentValue = Number(stockDrafts[id] ?? product.stock)
    const newStock = Math.max(
      0,
      (Number.isFinite(currentValue) ? currentValue : 0) + amount,
    )
    setStockDrafts((current) => ({ ...current, [id]: String(newStock) }))
    setStockError("")
  }

  function saveStockCount(product: Product) {
    const value = Number(stockDrafts[product.id] ?? product.stock)
    if (!Number.isFinite(value) || value < 0) {
      setStockError(`Enter a valid stock quantity for ${product.name}.`)
      return
    }
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, stock: value } : item,
      ),
    )
    setStockDrafts((current) => {
      const next = { ...current }
      delete next[product.id]
      return next
    })
    setStockError("")
    setNotice(`${product.name} stock count saved at ${value} ${product.unit}.`)
  }

  return (
    <main className="product-page operations-page">
      <header className="product-page-header">
        <div>
          <h1>Operations</h1>
          <p>Today’s tasks and stock at a glance</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => setModal(tab === "Tasks" ? "task" : "product")}
        >
          <AddIcon />
          {tab === "Tasks" ? "Create task" : "Add product"}
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
      {stockError && (
        <div className="section-error" role="alert">
          <span>{stockError}</span>
          <button type="button" onClick={() => setStockError("")}>
            Dismiss
          </button>
        </div>
      )}

      <section className="operations-overview" aria-label="Operations overview">
        <button type="button" onClick={() => setTab("Tasks")}>
          <span>Open tasks</span>
          <strong>
            {tasks.filter((task) => task.status !== "Completed").length}
          </strong>
          <small>2 due today</small>
        </button>
        <button
          className="attention"
          type="button"
          onClick={() => setTab("Inventory")}
        >
          <span>Low stock</span>
          <strong>{lowStock}</strong>
          <small>Review inventory</small>
        </button>
        <button type="button" onClick={() => setTab("Tasks")}>
          <span>Needs attention</span>
          <strong>
            {tasks.filter((task) => task.status === "Needs attention").length}
          </strong>
          <small>Action needed</small>
        </button>
        <button type="button" onClick={() => setTab("Tasks")}>
          <span>Completed</span>
          <strong>
            {tasks.filter((task) => task.status === "Completed").length}
          </strong>
          <small>Today</small>
        </button>
      </section>

      <div
        className="operations-tabs"
        role="tablist"
        aria-label="Operations sections"
      >
        {(["Tasks", "Inventory"] as const).map((value) => (
          <button
            className={tab === value ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            key={value}
          >
            {value}
            {value === "Inventory" && <span>{products.length}</span>}
          </button>
        ))}
      </div>

      {tab === "Tasks" ? (
        <div className="operations-layout">
          <section className="operations-main">
            <div className="panel-heading">
              <div>
                <h2>Current work</h2>
                <p>Keep the day moving</p>
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => setModal("task")}
              >
                Add task
              </button>
            </div>
            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-row" key={task.id}>
                  <button
                    className={`task-check ${
                      task.status === "Completed" ? "is-complete" : ""
                    }`}
                    type="button"
                    onClick={() =>
                      updateTask(
                        task.id,
                        task.status === "Completed" ? "Pending" : "Completed",
                      )
                    }
                    aria-label={
                      task.status === "Completed"
                        ? "Mark incomplete"
                        : "Mark complete"
                    }
                  >
                    {task.status === "Completed" && <CheckIcon />}
                  </button>
                  <button
                    className="task-copy"
                    type="button"
                    onClick={() => setSelectedTask(task)}
                  >
                    <strong>{task.name}</strong>
                    <small>{task.due}</small>
                  </button>
                  <select
                    className={`status-select status-${task.status.toLowerCase().replaceAll(" ", "-")}`}
                    value={task.status}
                    onChange={(event) =>
                      updateTask(task.id, event.target.value as TaskStatus)
                    }
                    aria-label={`Status for ${task.name}`}
                  >
                    <option>Pending</option>
                    <option>In progress</option>
                    <option>Completed</option>
                    <option>Needs attention</option>
                  </select>
                  <button
                    className="row-arrow"
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    aria-label={`Open ${task.name}`}
                  >
                    <ArrowIcon />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <aside className="operations-aside">
            <section className="work-note">
              <span>Next up</span>
              <strong>Golden Sun delivery</strong>
              <p>
                Expected at 2:00 PM. Clear space near the stock room before
                arrival.
              </p>
              <button type="button" onClick={() => setSelectedTask(tasks[0])}>
                View task <ArrowIcon />
              </button>
            </section>
            <section className="plain-section">
              <div className="panel-heading">
                <h2>Recent activity</h2>
              </div>
              <div className="activity-list">
                <div>
                  <i />
                  <span>
                    <strong>Ana updated cooler stock</strong>
                    <small>10:42 AM</small>
                  </span>
                </div>
                <div>
                  <i />
                  <span>
                    <strong>24 noodle packs received</strong>
                    <small>Yesterday</small>
                  </span>
                </div>
                <div>
                  <i />
                  <span>
                    <strong>Weekend price list completed</strong>
                    <small>Yesterday</small>
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      ) : (
        <section className="inventory-section">
          <div className="inventory-toolbar">
            <div>
              <h2>Inventory</h2>
              <p>{lowStock} items at or below reorder level</p>
            </div>
            <label className="section-search">
              <SearchIcon />
              <span className="sr-only">Search inventory</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
              />
            </label>
          </div>
          <div className="inventory-list">
            <div className="inventory-head">
              <span>Product</span>
              <span>Status</span>
              <span>In stock</span>
            </div>
            {visibleProducts.length ? (
              visibleProducts.map((product) => {
                const low = product.stock <= product.reorder
                return (
                  <div className="inventory-row" key={product.id}>
                    <span className="product-icon">
                      <BoxIcon />
                    </span>
                    <span className="product-copy">
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                    </span>
                    <span className={`stock-label ${low ? "is-low" : ""}`}>
                      {low ? "Low stock" : "In stock"}
                    </span>
                    <div className="stock-stepper">
                      <button
                        type="button"
                        onClick={() => adjustStock(product.id, -1)}
                        aria-label={`Remove one ${product.name}`}
                      >
                        −
                      </button>
                      <label>
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          value={stockDrafts[product.id] ?? product.stock}
                          onChange={(event) => {
                            setStockDrafts((current) => ({
                              ...current,
                              [product.id]: event.target.value,
                            }))
                            setStockError("")
                          }}
                          aria-label={`Stock count for ${product.name} in ${product.unit}`}
                        />
                        <small>{product.unit}</small>
                      </label>
                      <button
                        type="button"
                        onClick={() => adjustStock(product.id, 1)}
                        aria-label={`Add one ${product.name}`}
                      >
                        +
                      </button>
                      <button
                        className="save-stock-button"
                        type="button"
                        onClick={() => saveStockCount(product)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="inventory-empty">
                <strong>No matching products</strong>
                <p>
                  Check the spelling or clear the search to see all products.
                </p>
                <button type="button" onClick={() => setSearch("")}>
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {modal && (
        <OperationsModal
          mode={modal}
          onClose={() => setModal(null)}
          onAddTask={(name) => {
            setTasks((current) => [
              {
                id: Date.now(),
                name,
                due: "Today",
                status: "Pending",
                detail: "Added in this prototype.",
              },
              ...current,
            ])
            setModal(null)
            setNotice("Task created.")
          }}
          onAddProduct={(name, stock, unit) => {
            setProducts((current) => [
              {
                id: Date.now(),
                name,
                category: "Other",
                stock,
                unit,
                reorder: 5,
              },
              ...current,
            ])
            setModal(null)
            setNotice(`${name} added to inventory.`)
          }}
        />
      )}
      {selectedTask && (
        <div
          className="section-modal-backdrop"
          onMouseDown={() => setSelectedTask(null)}
        >
          <section
            className="section-modal detail-modal"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="section-modal-heading">
              <div>
                <h2>{selectedTask.name}</h2>
                <p>{selectedTask.due}</p>
              </div>
              <button
                className="section-icon-button"
                type="button"
                onClick={() => setSelectedTask(null)}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="task-detail-text">{selectedTask.detail}</p>
            <label className="section-field">
              <span>Status</span>
              <select
                value={selectedTask.status}
                onChange={(event) => {
                  const status = event.target.value as TaskStatus
                  updateTask(selectedTask.id, status)
                  setSelectedTask({ ...selectedTask, status })
                }}
              >
                <option>Pending</option>
                <option>In progress</option>
                <option>Completed</option>
                <option>Needs attention</option>
              </select>
            </label>
            <p className="prototype-note">
              Task changes are saved for this prototype session.
            </p>
          </section>
        </div>
      )}
    </main>
  )
}

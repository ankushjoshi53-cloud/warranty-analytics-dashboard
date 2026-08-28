'use client'

type FiltersProps = {
  states: string[]
  districts: string[]
  segments: string[]
  categories: string[]
  models: string[]
  failures: string[]
  selected: {
    state: string
    district: string
    segment: string
    category: string
    model: string
    failure: string
  }
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export default function Filters({
  states,
  districts,
  segments,
  categories,
  models,
  failures,
  selected,
  onChange,
  onReset,
}: FiltersProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">
            Dashboard Filters
          </h2>

          <p className="text-sm text-slate-500">
            Filters are linked — each selection narrows the next filter
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm hover:bg-slate-50"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">

        <Filter
          label="State"
          value={selected.state}
          options={states}
          onChange={(v) => onChange('state', v)}
        />

        <Filter
          label="District"
          value={selected.district}
          options={districts}
          onChange={(v) => onChange('district', v)}
        />

        <Filter
          label="Segment"
          value={selected.segment}
          options={segments}
          onChange={(v) => onChange('segment', v)}
        />

        <Filter
          label="Category"
          value={selected.category}
          options={categories}
          onChange={(v) => onChange('category', v)}
        />

        <Filter
          label="Model"
          value={selected.model}
          options={models}
          onChange={(v) => onChange('model', v)}
        />

        <Filter
          label="Failure"
          value={selected.failure}
          options={failures}
          onChange={(v) => onChange('failure', v)}
        />

      </div>
    </section>
  )
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">All {label}s</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
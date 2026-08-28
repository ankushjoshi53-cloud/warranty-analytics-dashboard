'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { supabase } from '@/lib/supabase'
import Filters from '@/components/Filters'

type Warranty = {
  complaint_id: string
  login_date: string
  customer_name: string
  district: string
  state: string
  segment: string
  category: string
  model: string
  serial_number: string
  purchase_date: string
  mfg: string
  warranty: string
  spend_life: string
  spend_life_failure: string
  fault_description: string
  verified_date: string
  closing_date: string
}

const colors = [
  '#2563eb',
  '#16a34a',
  '#f59e0b',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
]

export default function Home() {
  /* =========================================================
     DATA
  ========================================================= */

  const [data, setData] = useState<Warranty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* =========================================================
     FILTER STATE
  ========================================================= */

  const [filters, setFilters] = useState({
    state: '',
    district: '',
    segment: '',
    category: '',
    model: '',
    failure: '',
  })

  /* =========================================================
     LOAD DATA FROM SUPABASE
  ========================================================= */

  useEffect(() => {
    async function loadData() {
      setLoading(true)

      const { data, error } = await supabase
        .from('warranty_master')
        .select('*')
        .limit(5000)

      if (error) {
        setError(error.message)
        setData([])
      } else {
        setData((data || []) as Warranty[])
      }

      setLoading(false)
    }

    loadData()
  }, [])

  /* =========================================================
     UNIQUE VALUE HELPER
  ========================================================= */

  const unique = (values: string[]) =>
    [...new Set(values.filter(Boolean))].sort()

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const states = useMemo(() => {
    return unique(data.map(r => r.state))
  }, [data])

  const districts = useMemo(() => {
    return unique(
      data
        .filter(
          r =>
            !filters.state ||
            r.state === filters.state
        )
        .map(r => r.district)
    )
  }, [data, filters.state])

  const segments = useMemo(() => {
    return unique(
      data
        .filter(
          r =>
            (!filters.state ||
              r.state === filters.state) &&
            (!filters.district ||
              r.district === filters.district)
        )
        .map(r => r.segment)
    )
  }, [data, filters.state, filters.district])

  const categories = useMemo(() => {
    return unique(
      data
        .filter(
          r =>
            (!filters.state ||
              r.state === filters.state) &&
            (!filters.district ||
              r.district === filters.district) &&
            (!filters.segment ||
              r.segment === filters.segment)
        )
        .map(r => r.category)
    )
  }, [
    data,
    filters.state,
    filters.district,
    filters.segment,
  ])

  const models = useMemo(() => {
    return unique(
      data
        .filter(
          r =>
            (!filters.state ||
              r.state === filters.state) &&
            (!filters.district ||
              r.district === filters.district) &&
            (!filters.segment ||
              r.segment === filters.segment) &&
            (!filters.category ||
              r.category === filters.category)
        )
        .map(r => r.model)
    )
  }, [
    data,
    filters.state,
    filters.district,
    filters.segment,
    filters.category,
  ])

  const failures = useMemo(() => {
    return unique(
      data
        .filter(
          r =>
            (!filters.state ||
              r.state === filters.state) &&
            (!filters.district ||
              r.district === filters.district) &&
            (!filters.segment ||
              r.segment === filters.segment) &&
            (!filters.category ||
              r.category === filters.category) &&
            (!filters.model ||
              r.model === filters.model)
        )
        .map(r => r.fault_description)
    )
  }, [
    data,
    filters.state,
    filters.district,
    filters.segment,
    filters.category,
    filters.model,
  ])

  /* =========================================================
     APPLY FILTERS
  ========================================================= */

  const filteredData = useMemo(() => {
    return data.filter(r => {
      if (
        filters.state &&
        r.state !== filters.state
      ) {
        return false
      }

      if (
        filters.district &&
        r.district !== filters.district
      ) {
        return false
      }

      if (
        filters.segment &&
        r.segment !== filters.segment
      ) {
        return false
      }

      if (
        filters.category &&
        r.category !== filters.category
      ) {
        return false
      }

      if (
        filters.model &&
        r.model !== filters.model
      ) {
        return false
      }

      if (
        filters.failure &&
        r.fault_description !== filters.failure
      ) {
        return false
      }

      return true
    })
  }, [data, filters])

  /* =========================================================
     FILTER HANDLER
  ========================================================= */

  function handleFilterChange(
    key: string,
    value: string
  ) {
    setFilters(prev => {
      if (key === 'state') {
        return {
          state: value,
          district: '',
          segment: '',
          category: '',
          model: '',
          failure: '',
        }
      }

      if (key === 'district') {
        return {
          ...prev,
          district: value,
          segment: '',
          category: '',
          model: '',
          failure: '',
        }
      }

      if (key === 'segment') {
        return {
          ...prev,
          segment: value,
          category: '',
          model: '',
          failure: '',
        }
      }

      if (key === 'category') {
        return {
          ...prev,
          category: value,
          model: '',
          failure: '',
        }
      }

      if (key === 'model') {
        return {
          ...prev,
          model: value,
          failure: '',
        }
      }

      if (key === 'failure') {
        return {
          ...prev,
          failure: value,
        }
      }

      return prev
    })
  }

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  function resetFilters() {
    setFilters({
      state: '',
      district: '',
      segment: '',
      category: '',
      model: '',
      failure: '',
    })
  }

  /* =========================================================
     BASIC KPIs
  ========================================================= */

  const totalComplaints = filteredData.length

  const uniqueCustomers = new Set(
    filteredData
      .map(r => r.customer_name)
      .filter(Boolean)
  ).size

  const uniqueModels = new Set(
    filteredData
      .map(r => r.model)
      .filter(Boolean)
  ).size

  const uniqueStates = new Set(
    filteredData
      .map(r => r.state)
      .filter(Boolean)
  ).size

  /* =========================================================
     CASE STATUS
  ========================================================= */

  const openCases = filteredData.filter(
    r =>
      !r.closing_date ||
      r.closing_date.trim() === ''
  ).length

  const closedCases =
    totalComplaints - openCases

  /* =========================================================
     SPEND LIFE FAILURE KPIs
  ========================================================= */

  const initialFailures = filteredData.filter(
    r =>
      r.spend_life_failure
        ?.toLowerCase()
        .includes('initial')
  ).length

  const midFailures = filteredData.filter(
    r =>
      r.spend_life_failure
        ?.toLowerCase()
        .includes('mid')
  ).length

  const endFailures = filteredData.filter(
    r =>
      r.spend_life_failure
        ?.toLowerCase()
        .includes('end')
  ).length

  /* =========================================================
     DAILY TREND
  ========================================================= */

  const dailyTrend = useMemo(() => {
    const map: Record<string, number> = {}

    filteredData.forEach(r => {
      if (!r.login_date) return

      map[r.login_date] =
        (map[r.login_date] || 0) + 1
    })

    return Object.entries(map)
      .sort(
        (a, b) =>
          new Date(a[0]).getTime() -
          new Date(b[0]).getTime()
      )
      .map(([name, complaints]) => ({
        name,
        complaints,
      }))
  }, [filteredData])

  /* =========================================================
     TOP MODELS
  ========================================================= */

  const modelData = useMemo(() => {
    const map: Record<string, number> = {}

    filteredData.forEach(r => {
      const key = r.model || 'Unknown'

      map[key] =
        (map[key] || 0) + 1
    })

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        value,
      }))
  }, [filteredData])

  /* =========================================================
     FAILURE DATA
  ========================================================= */

  const failureData = useMemo(() => {
    const map: Record<string, number> = {}

    filteredData.forEach(r => {
      const key =
        r.fault_description ||
        'Not Specified'

      map[key] =
        (map[key] || 0) + 1
    })

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        value,
      }))
  }, [filteredData])

  /* =========================================================
     STATE DATA
  ========================================================= */

  const stateData = useMemo(() => {
    const map: Record<string, number> = {}

    filteredData.forEach(r => {
      const key = r.state || 'Unknown'

      map[key] =
        (map[key] || 0) + 1
    })

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        value,
      }))
  }, [filteredData])

  /* =========================================================
     CATEGORY DATA
  ========================================================= */

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}

    filteredData.forEach(r => {
      const key =
        r.category || 'Unknown'

      map[key] =
        (map[key] || 0) + 1
    })

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({
        name,
        value,
      }))
  }, [filteredData])

  /* =========================================================
     MANAGEMENT SUMMARY CALCULATIONS
  ========================================================= */

  const topFailureCount =
    failureData[0]?.value || 0

  const topFailurePercentage =
    totalComplaints > 0
      ? Math.round(
          (topFailureCount /
            totalComplaints) *
            100
        )
      : 0

  const midLifePercentage =
    totalComplaints > 0
      ? Math.round(
          (midFailures /
            totalComplaints) *
            100
        )
      : 0

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-xl font-semibold">
          Loading warranty data...
        </div>
      </main>
    )
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-10">
        <div className="bg-red-100 text-red-700 p-6 rounded-xl">
          <h1 className="text-xl font-bold">
            Supabase Error
          </h1>

          <p className="mt-2">
            {error}
          </p>
        </div>
      </main>
    )
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-100">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="bg-slate-950 text-white px-8 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Warranty Analytics
            </h1>

            <p className="text-slate-400 mt-1">
              Quality & Warranty Management Dashboard
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">
              DATA SOURCE
            </div>

            <div className="font-semibold">
              Supabase
            </div>
          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="max-w-7xl mx-auto p-6">

        {/* ===================================================
            FILTERS
        =================================================== */}

        <Filters
          states={states}
          districts={districts}
          segments={segments}
          categories={categories}
          models={models}
          failures={failures}
          selected={filters}
          onChange={handleFilterChange}
          onReset={resetFilters}
        />

        {/* ===================================================
            KPI CARDS
        =================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">

          <KPI
            title="Total Complaints"
            value={totalComplaints}
          />

          <KPI
            title="Unique Customers"
            value={uniqueCustomers}
          />

          <KPI
            title="Affected Models"
            value={uniqueModels}
          />

          <KPI
            title="States"
            value={uniqueStates}
          />

          <KPI
            title="Mid-Life Failures"
            value={midFailures}
          />

          <KPI
            title="End-Life Failures"
            value={endFailures}
          />

        </div>

        {/* ===================================================
            CASE STATUS MINI SUMMARY
        =================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <KPI
            title="Open Cases"
            value={openCases}
          />

          <KPI
            title="Closed Cases"
            value={closedCases}
          />

          <KPI
            title="Initial Failures"
            value={initialFailures}
          />

          <KPI
            title="Mid-Life %"
            value={midLifePercentage}
          />

        </div>

        {/* ===================================================
            DAILY TREND
        =================================================== */}

        <ChartCard title="Daily Complaint Trend">

          <div className="h-80">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={dailyTrend}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="complaints"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </ChartCard>

        {/* ===================================================
            TOP MODELS + FAILURE MODES
        =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* TOP MODELS */}

          <ChartCard title="Top 10 Models">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={modelData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis type="number" />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[0, 4, 4, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

          {/* TOP FAILURE MODES */}

          <ChartCard title="Top Failure Modes">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={failureData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 20,
                  left: 20,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis type="number" />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#dc2626"
                  radius={[0, 4, 4, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

        </div>

        {/* ===================================================
            STATE + CATEGORY
        =================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* STATE */}

          <ChartCard title="Complaints by State">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={stateData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 50,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

          {/* CATEGORY */}

          <ChartCard title="Complaint Category">

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >

                  {categoryData.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colors[
                            index %
                              colors.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </ChartCard>

        </div>

        {/* ===================================================
            MANAGEMENT SUMMARY
        =================================================== */}

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">

          <h2 className="text-xl font-bold mb-4">
            Management Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* TOP MODEL */}

            <Summary
              title="Top Model"
              value={
                modelData[0]?.name ||
                'N/A'
              }
              detail={
                modelData[0]
                  ? `${modelData[0].value} complaints`
                  : 'No data'
              }
            />

            {/* TOP FAILURE */}

            <Summary
              title="Top Failure"
              value={
                failureData[0]?.name ||
                'N/A'
              }
              detail={
                failureData[0]
                  ? `${failureData[0].value} complaints (${topFailurePercentage}%)`
                  : 'No data'
              }
            />

            {/* FAILURE CONCENTRATION */}

            <Summary
              title="Failure Concentration"
              value={`${midLifePercentage}% Mid-Life`}
              detail="of filtered complaints"
            />

          </div>

        </section>

      </div>

    </main>
  )
}

/* ===========================================================
   KPI COMPONENT
=========================================================== */

function KPI({
  title,
  value,
}: {
  title: string
  value: number
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value.toLocaleString()}
      </p>

    </div>
  )
}

/* ===========================================================
   CHART CARD COMPONENT
=========================================================== */

function ChartCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <h2 className="text-lg font-bold mb-4">
        {title}
      </h2>

      {children}

    </section>
  )
}

/* ===========================================================
   MANAGEMENT SUMMARY COMPONENT
=========================================================== */

function Summary({
  title,
  value,
  detail,
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="text-lg font-bold mt-2">
        {value}
      </p>

      <p className="text-sm text-slate-500 mt-1">
        {detail}
      </p>

    </div>
  )
}
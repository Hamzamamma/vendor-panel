import { useState } from "react"
import { CalendarMini, SquaresPlus, CogSixTooth, TrianglesMini } from "@medusajs/icons"
import {
  Button,
  Text,
  toast,
  Container,
  Heading,
  DropdownMenu,
} from "@medusajs/ui"
import { Link, useSearchParams } from "react-router-dom"
import { useMe } from "../../../hooks/api"
import { useTranslation } from "react-i18next"
import { addDays, format, subDays } from "date-fns"
import { MEDUSA_STOREFRONT_URL } from "../../../lib/storefront"
import { ExtendedAdminOrder } from "../../../types/order"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Chart Card Component
const ChartCard = ({ 
  title, 
  dateRange, 
  value,
  children 
}: { 
  title: string
  dateRange: string
  value?: string | number
  children: React.ReactNode 
}) => {
  const { t } = useTranslation()
  return (
    <Container className="p-0">
      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-5 flex flex-col justify-between min-h-[320px]">
        <div>
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1">
              <Heading level="h3" className="font-semibold text-sm">{title}</Heading>
              {value !== undefined && (
                <Heading level="h2" className="text-2xl font-bold mt-2">
                  {typeof value === 'number' ? (value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`) : value}
                </Heading>
              )}
            </div>
            <Button variant="transparent" size="small" asChild>
              <a href="#">
                <Text size="small" weight="plus">{t("dashboard.fullReport")}</Text>
              </a>
            </Button>
          </div>
          <Text size="xsmall" className="text-ui-fg-subtle mb-6">{dateRange}</Text>
          <div className="w-full -ml-4">
            {children}
          </div>
        </div>
      </div>
    </Container>
  )
}

// Empty State Card Component
const EmptyStateCard = ({ 
  title, 
  dateRange, 
  message 
}: { 
  title: string
  dateRange: string
  message: string 
}) => {
  const { t } = useTranslation()
  return (
    <Container className="p-0">
      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-5 flex flex-col min-h-[200px]">
        <div className="mb-2">
          <div className="flex justify-between items-start mb-1">
            <Heading level="h3" className="font-semibold text-sm">{title}</Heading>
            <Button variant="transparent" size="small" asChild>
              <a href="#">
                <Text size="small" weight="plus">{t("dashboard.fullReport")}</Text>
              </a>
            </Button>
          </div>
          <Text size="xsmall" className="text-ui-fg-subtle">{dateRange}</Text>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Text size="small" className="text-ui-fg-subtle text-center px-4">{message}</Text>
        </div>
      </div>
    </Container>
  )
}

export const DashboardCharts = ({
  orders,
}: {
  orders?: ExtendedAdminOrder[]
}) => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { seller } = useMe()
  
  const [dateRange, setDateRange] = useState("last7days")
  const [groupBy, setGroupBy] = useState("day")

  // Default to last 30 days
  const defaultFrom = format(addDays(new Date(), -30), "yyyy-MM-dd")
  const defaultTo = format(new Date(), "yyyy-MM-dd")

  const from = (searchParams.get("from") || defaultFrom) as unknown as Date
  const to = (searchParams.get("to") || defaultTo) as unknown as Date

  // Check if it's "Last 30 days"
  const isLast30Days = 
    format(from, "yyyy-MM-dd") === defaultFrom &&
    format(to, "yyyy-MM-dd") === defaultTo

  const handleLast30Days = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("from", defaultFrom)
    newSearchParams.set("to", defaultTo)
    setSearchParams(newSearchParams)
  }

  const storeUrl = seller?.handle
    ? `${MEDUSA_STOREFRONT_URL}/vendor/${seller.handle}`
    : null

  const handleCopyUrl = async () => {
    if (storeUrl) {
      await navigator.clipboard.writeText(storeUrl)
      toast.success("URL copiato negli appunti")
    }
  }

  // Calculate date range for Google Analytics section
  const getDateRange = () => {
    const today = new Date()
    let fromDate: Date
    
    switch (dateRange) {
      case "today":
        fromDate = new Date(today)
        fromDate.setHours(0, 0, 0, 0)
        break
      case "yesterday":
        fromDate = subDays(today, 1)
        fromDate.setHours(0, 0, 0, 0)
        break
      case "last7days":
        fromDate = subDays(today, 7)
        break
      case "last30days":
        fromDate = subDays(today, 30)
        break
      case "last90days":
        fromDate = subDays(today, 90)
        break
      default:
        fromDate = subDays(today, 7)
    }
    
    return {
      from: fromDate,
      to: today,
      text: `${format(fromDate, "MMM dd, yyyy")} - ${format(today, "MMM dd, yyyy")}`
    }
  }

  const dateRangeData = getDateRange()

  // Mock chart data
  const chartData = [
    { date: format(subDays(new Date(), 6), "MMM dd"), value: 0 },
    { date: format(subDays(new Date(), 5), "MMM dd"), value: 0 },
    { date: format(subDays(new Date(), 4), "MMM dd"), value: 0 },
    { date: format(subDays(new Date(), 3), "MMM dd"), value: 0 },
    { date: format(subDays(new Date(), 2), "MMM dd"), value: 0 },
    { date: format(subDays(new Date(), 1), "MMM dd"), value: 0 },
    { date: format(new Date(), "MMM dd"), value: 0 },
  ]

  return (
    <div className="flex flex-col gap-y-6 w-full px-4 md:px-8">
      {/* Top Bar with Date Filter and Store URL */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="small"
            onClick={handleLast30Days}
            className={isLast30Days ? "bg-ui-bg-subtle" : ""}
          >
            <CalendarMini className="w-4 h-4" />
            {t("dashboard.last30Days")}
          </Button>
        </div>
        {storeUrl && (
          <div className="flex items-center gap-2">
            <Text size="small" className="text-ui-fg-subtle">
              {storeUrl}
            </Text>
            <Button
              variant="transparent"
              size="small"
              onClick={handleCopyUrl}
              className="p-1"
              title="Copia URL"
            >
              <SquaresPlus className="w-4 h-4 text-ui-fg-muted" />
            </Button>
            <Link to="/settings/store">
              <Button
                variant="transparent"
                size="small"
                className="p-1"
              >
                <CogSixTooth className="w-4 h-4 text-ui-fg-muted" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Google Analytics Section */}
      <div className="flex flex-col gap-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Heading level="h1">{t("googleAnalytics.domain")}</Heading>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" size="small">
                <CalendarMini className="w-4 h-4" />
                {dateRange === "today" ? "Today" :
                 dateRange === "yesterday" ? "Yesterday" :
                 dateRange === "last7days" ? "Last 7 days" :
                 dateRange === "last30days" ? "Last 30 days" :
                 dateRange === "last90days" ? "Last 90 days" : "Last 7 days"}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.RadioGroup value={dateRange} onValueChange={setDateRange}>
                <DropdownMenu.RadioItem value="today">Today</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="yesterday">Yesterday</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="last7days">Last 7 days</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="last30days">Last 30 days</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="last90days">Last 90 days</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" size="small">
                <TrianglesMini className="w-4 h-4" />
                {groupBy === "hour" ? "Hour" : "Day"}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.RadioGroup value={groupBy} onValueChange={setGroupBy}>
                <DropdownMenu.RadioItem value="hour">Hour</DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="day">Day</DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>

        {/* Metrics Grid */}
        {/* First Row: Profit (larger) and Orders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profit Card - Takes 2 columns */}
          <div className="md:col-span-2">
            <ChartCard 
              title={t("dashboard.profit")} 
              dateRange={dateRangeData.text}
              value={0}
            >
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="0" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 11}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 11}} 
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#111827" 
                    strokeWidth={2} 
                    dot={{r: 3, fill: '#111827'}} 
                    activeDot={{r: 5}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Orders Card - Takes 1 column */}
          <div className="md:col-span-1">
            <ChartCard 
              title={t("dashboard.orders")} 
              dateRange={dateRangeData.text}
              value={0}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={24}>
                  <CartesianGrid vertical={false} strokeDasharray="0" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 11}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 11}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#111827" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Rest of the cards in normal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Average Order Value Card */}
          <ChartCard 
            title={t("dashboard.averageShopOrderValue")} 
            dateRange={dateRangeData.text}
            value={0}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="0" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 11}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6B7280', fontSize: 11}} 
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#111827" 
                  strokeWidth={2} 
                  dot={{r: 3, fill: '#111827'}} 
                  activeDot={{r: 5}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Products Card */}
          <EmptyStateCard 
            title={t("dashboard.topProducts.title")} 
            dateRange={dateRangeData.text} 
            message={t("dashboard.topProducts.noData")} 
          />

          {/* Sales by Country Card */}
          <EmptyStateCard 
            title={t("dashboard.salesByCountry.title")} 
            dateRange={dateRangeData.text} 
            message={t("dashboard.salesByCountry.noData")} 
          />

          {/* Payment Method Card */}
          <EmptyStateCard 
            title={t("dashboard.paymentMethod.title")} 
            dateRange={dateRangeData.text} 
            message={t("dashboard.paymentMethod.noData")} 
          />
        </div>
      </div>
    </div>
  )
}

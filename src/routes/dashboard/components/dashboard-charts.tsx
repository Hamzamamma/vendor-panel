import { CalendarMini, SquaresPlus, CogSixTooth } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Text,
  toast,
} from "@medusajs/ui"
import { Link, useSearchParams } from "react-router-dom"
import { useMe } from "../../../hooks/api"
import { useMemo, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { addDays, format } from "date-fns"
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

export const DashboardCharts = ({
  orders,
}: {
  orders?: ExtendedAdminOrder[]
}) => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { seller } = useMe()

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


  // Calculate statistics from orders filtered by date range
  const filteredOrders = useMemo(() => {
    if (!orders) return []
    const fromDate = new Date(from)
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    
    return orders.filter((order) => {
      const orderDate = new Date(order.created_at)
      return orderDate >= fromDate && orderDate <= toDate
    })
  }, [orders, from, to])

  // Generate chart data grouped by day
  const chartData = useMemo(() => {
    const dataMap = new Map<string, { profit: number; orders: number; totalRevenue: number }>()
    
    filteredOrders.forEach((order) => {
      const dateKey = format(new Date(order.created_at), "MMM dd")
      const profit = order.split_order_payment 
        ? order.split_order_payment.captured_amount - order.split_order_payment.refunded_amount
        : 0
      
      const existing = dataMap.get(dateKey) || { profit: 0, orders: 0, totalRevenue: 0 }
      dataMap.set(dateKey, {
        profit: existing.profit + profit,
        orders: existing.orders + 1,
        totalRevenue: existing.totalRevenue + profit,
      })
    })
    
    return Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        profit: data.profit,
        orders: data.orders,
        aov: data.orders > 0 ? data.totalRevenue / data.orders : 0,
      }))
      .sort((a, b) => {
        // Sort by date
        const dateA = new Date(a.date + " " + new Date().getFullYear())
        const dateB = new Date(b.date + " " + new Date().getFullYear())
        return dateA.getTime() - dateB.getTime()
      })
  }, [filteredOrders])

  const storeUrl = seller?.handle
    ? `${MEDUSA_STOREFRONT_URL}/vendor/${seller.handle}`
    : null

  const handleCopyUrl = async () => {
    if (storeUrl) {
      await navigator.clipboard.writeText(storeUrl)
      toast.success("URL copiato negli appunti")
    }
  }

  const dateRangeText = `${format(from, "LLL dd, y")} - ${format(to, "LLL dd, y")}`

  return (
    <div className="mx-auto w-full max-w-[850px] flex flex-col gap-y-6">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {/* Profit Chart */}
        <ChartCard title={t("dashboard.profit")} dateRange={dateRangeText}>
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
                dataKey="profit" 
                stroke="#111827" 
                strokeWidth={2} 
                dot={{r: 3, fill: '#111827'}} 
                activeDot={{r: 5}} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Orders Chart */}
        <ChartCard title={t("dashboard.orders")} dateRange={dateRangeText}>
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
                dataKey="orders" 
                fill="#111827" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Average Order Value Chart */}
        <ChartCard title={t("dashboard.averageShopOrderValue")} dateRange={dateRangeText}>
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
                dataKey="aov" 
                stroke="#111827" 
                strokeWidth={2} 
                dot={{r: 3, fill: '#111827'}} 
                activeDot={{r: 5}} 
              />
                </LineChart>
              </ResponsiveContainer>
        </ChartCard>

        {/* Top Products Empty State */}
        <EmptyStateCard 
          title={t("dashboard.topProducts.title")} 
          dateRange={dateRangeText} 
          message={t("dashboard.topProducts.noData")} 
        />

        {/* Sales by Country Empty State */}
        <EmptyStateCard 
          title={t("dashboard.salesByCountry.title")} 
          dateRange={dateRangeText} 
          message={t("dashboard.salesByCountry.noData")} 
        />

        {/* Payment Method Empty State */}
        <EmptyStateCard 
          title={t("dashboard.paymentMethod.title")} 
          dateRange={dateRangeText} 
          message={t("dashboard.paymentMethod.noData")} 
        />
          </div>
                  </div>
  )
}

// Chart Card Component
const ChartCard = ({ title, dateRange, children }: { title: string; dateRange: string; children: ReactNode }) => {
  const { t } = useTranslation()
  return (
    <Container className="p-0">
      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-5 flex flex-col justify-between min-h-[320px]">
        <div>
          <div className="flex justify-between items-start mb-1">
            <Heading level="h3" className="font-semibold">{title}</Heading>
                  </div>
          <Text size="xsmall" className="text-ui-fg-subtle mb-6">{dateRange}</Text>
          <div className="w-full -ml-4">
            {children}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-ui-border-base">
          <Button variant="transparent" size="small" asChild>
            <Link to="/products">
              <Text size="small" weight="plus">{t("dashboard.fullReport")}</Text>
            </Link>
          </Button>
          </div>
        </div>
      </Container>
  )
}

// Empty State Card Component
const EmptyStateCard = ({ title, dateRange, message }: { title: string; dateRange: string; message: string }) => {
  const { t } = useTranslation()
  return (
    <Container className="p-0">
      <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-5 flex flex-col min-h-[200px]">
        <div className="mb-2">
          <Heading level="h3" className="font-semibold">{title}</Heading>
          <Text size="xsmall" className="text-ui-fg-subtle">{dateRange}</Text>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Text size="small" className="text-ui-fg-subtle text-center px-4">{message}</Text>
        </div>
        <div className="mt-4 pt-4 border-t border-ui-border-base">
          <Button variant="transparent" size="small">
            <Text size="small" weight="plus">{t("dashboard.fullReport")}</Text>
          </Button>
        </div>
      </div>
    </Container>
  )
}

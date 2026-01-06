import { useState } from "react"
import {
  Button,
  Container,
  Heading,
  Text,
  Alert,
  DropdownMenu,
} from "@medusajs/ui"
import { CalendarMini, TrianglesMini } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { useDashboardExtension } from "../../extensions"
import { SingleColumnPage } from "../../components/layout/pages"
import { GoogleAnalyticsIcon } from "../../assets/icons/GoogleAnalytics"
import { format, subDays } from "date-fns"
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

export const GoogleAnalytics = () => {
  const { t } = useTranslation()
  const { getWidgets } = useDashboardExtension()
  
  const [dateRange, setDateRange] = useState("last7days")
  const [groupBy, setGroupBy] = useState("day")
  const [isConnected, setIsConnected] = useState(false)
  const [hasConnectionIssue, setHasConnectionIssue] = useState(false)

  // Calculate date range
  const getDateRange = () => {
    const today = new Date()
    let from: Date
    
    switch (dateRange) {
      case "today":
        from = new Date(today)
        from.setHours(0, 0, 0, 0)
        break
      case "yesterday":
        from = subDays(today, 1)
        from.setHours(0, 0, 0, 0)
        break
      case "last7days":
        from = subDays(today, 7)
        break
      case "last30days":
        from = subDays(today, 30)
        break
      case "last90days":
        from = subDays(today, 90)
        break
      default:
        from = subDays(today, 7)
    }
    
    return {
      from,
      to: today,
      text: `${format(from, "MMM dd, yyyy")} - ${format(today, "MMM dd, yyyy")}`
    }
  }

  const dateRangeData = getDateRange()

  // Mock chart data (empty for now)
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
    <SingleColumnPage
      widgets={{
        before: getWidgets("google_analytics.details.before"),
        after: getWidgets("google_analytics.details.after"),
      }}
      hasOutlet={false}
    >
      <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-y-6 px-6">
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

        {/* Google Analytics Connection Section */}
        <Container className="p-0">
          <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <GoogleAnalyticsIcon />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Text weight="plus" size="small" className="mb-1">
                      {t("googleAnalytics.seeAdvancedAnalytics")}
                    </Text>
                    {isConnected ? (
                      <div className="flex items-center gap-2 mt-2">
                        <Text size="small" className="text-ui-fg-subtle">
                          {t("googleAnalytics.connectedTo")} hamzalemzaroual7@gmail.com
                        </Text>
                        <Button 
                          variant="transparent" 
                          size="small"
                          onClick={() => setIsConnected(false)}
                        >
                          <Text size="small">{t("googleAnalytics.disconnect")}</Text>
                        </Button>
                      </div>
                    ) : (
                      <Text size="small" className="text-ui-fg-subtle mt-2">
                        {t("googleAnalytics.notConnected")}
                      </Text>
                    )}
                  </div>
                  {hasConnectionIssue && (
                    <div className="flex items-center gap-2 text-ui-fg-error">
                      <Text size="small" className="text-ui-fg-error">
                        {t("googleAnalytics.connectionIssue")}
                      </Text>
                    </div>
                  )}
                </div>
                {hasConnectionIssue && (
                  <Alert variant="error" className="mt-4">
                    <Text size="small">
                      {t("googleAnalytics.missingAccess")}
                    </Text>
                  </Alert>
                )}
                {!isConnected && (
                  <Button variant="secondary" size="small" className="mt-4">
                    {t("googleAnalytics.connectAccount")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profit Card */}
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

          {/* Orders Card */}
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
    </SingleColumnPage>
  )
}

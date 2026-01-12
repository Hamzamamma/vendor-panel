import { Button, Heading, Text, Badge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDisconnectGoogleAccount } from "../../../hooks/api/google"
import { CheckCircle, XCircle, Clock } from "@medusajs/icons"
import { OnboardingChecklist } from "./onboarding-checklist"
import { MerchantCenterStatus } from "./merchant-center-status"
import { ConversionsDashboard } from "./conversions-dashboard"
import { ConversionTrackingCard } from "./conversion-tracking-card"

export const Connected = ({
  status,
  account,
}: {
  status: "connected" | "pending" | "not connected"
  account: any
}) => {
  const { t } = useTranslation()
  const { mutateAsync: disconnect, isPending: isDisconnecting } =
    useDisconnectGoogleAccount()

  const handleDisconnect = async () => {
    if (confirm(t("googleYouTube.disconnectAccount") + "?")) {
      await disconnect()
    }
  }

  const getStatusIcon = () => {
    if (status === "connected") {
      return <CheckCircle className="w-5 h-5 text-ui-tag-green-icon" />
    } else if (status === "pending") {
      return <Clock className="w-5 h-5 text-ui-tag-orange-icon" />
    } else {
      return <XCircle className="w-5 h-5 text-ui-tag-red-icon" />
    }
  }

  const getStatusBadge = () => {
    if (status === "connected") {
      return (
        <Badge color="green" size="small">
          {t("googleYouTube.connected")}
        </Badge>
      )
    } else if (status === "pending") {
      return (
        <Badge color="orange" size="small">
          {t("googleYouTube.pending")}
        </Badge>
      )
    } else {
      return (
        <Badge color="red" size="small">
          {t("googleYouTube.notConnected")}
        </Badge>
      )
    }
  }

  return (
    <div className="flex flex-col gap-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          {getStatusIcon()}
          <div>
            <Heading level="h3">{t("googleYouTube.domain")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {account?.email || account?.merchant_center_id || account?.account_id || t("googleYouTube.notConnected")}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          {getStatusBadge()}
          <Button
            variant="secondary"
            size="small"
            onClick={handleDisconnect}
            isLoading={isDisconnecting}
          >
            {t("googleYouTube.disconnectAccount")}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Onboarding Checklist */}
        <div className="lg:col-span-1">
          <OnboardingChecklist account={account} />
        </div>

        {/* Right Column - Conversion Tracking Card */}
        <div className="lg:col-span-1">
          <ConversionTrackingCard />
        </div>
      </div>

      {/* Merchant Center Status */}
      <MerchantCenterStatus account={account} />

      {/* Conversions Dashboard */}
      <ConversionsDashboard />
    </div>
  )
}


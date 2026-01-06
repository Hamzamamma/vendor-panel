import { Heading, Text, Button, Badge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useGoogleMerchantCenter, useSyncProducts } from "../../../hooks/api/google"
import { CheckCircle, XCircle, Clock } from "@medusajs/icons"
import { toast } from "@medusajs/ui"

export const MerchantCenterStatus = ({ account }: { account: any }) => {
  const { t } = useTranslation()
  const merchantCenterData = useGoogleMerchantCenter()
  // Handle different data formats
  const merchant_center = merchantCenterData?.merchant_center || merchantCenterData?.data || merchantCenterData
  const isPending = merchantCenterData?.isPending || false
  const isError = merchantCenterData?.isError || false
  const { mutateAsync: syncProducts, isPending: isSyncing } = useSyncProducts()

  const handleSync = async () => {
    try {
      await syncProducts({})
      toast.success("Prodotti sincronizzati con successo")
    } catch (error: any) {
      toast.error(error?.message || t("googleYouTube.errors.syncFailed"))
    }
  }

  const getStatusIcon = () => {
    if (merchant_center?.status === "active") {
      return <CheckCircle className="w-4 h-4 text-ui-tag-green-icon" />
    } else if (merchant_center?.status === "pending") {
      return <Clock className="w-4 h-4 text-ui-tag-orange-icon" />
    } else {
      return <XCircle className="w-4 h-4 text-ui-tag-red-icon" />
    }
  }

  const getStatusBadge = () => {
    if (merchant_center?.status === "active") {
      return (
        <Badge color="green" size="2xsmall">
          {t("googleYouTube.connected")}
        </Badge>
      )
    } else if (merchant_center?.status === "pending") {
      return (
        <Badge color="orange" size="2xsmall">
          {t("googleYouTube.pending")}
        </Badge>
      )
    } else {
      return (
        <Badge color="red" size="2xsmall">
          {t("googleYouTube.notConnected")}
        </Badge>
      )
    }
  }

  return (
    <div className="bg-ui-bg-subtle rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Heading level="h3">{t("googleYouTube.merchantCenter.title")}</Heading>
        {getStatusBadge()}
      </div>

      {isPending ? (
        <Text className="text-ui-fg-subtle" size="small">
          {t("general.loading") || "Caricamento..."}
        </Text>
      ) : isError ? (
        <Text className="text-ui-fg-error" size="small">
          {t("googleYouTube.errors.connectionFailed")}
        </Text>
      ) : merchant_center ? (
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            {getStatusIcon()}
            <div className="flex-1">
              <Text size="small" weight="plus" className="mb-1">
                {t("googleYouTube.merchantCenter.status")}
              </Text>
              <Text size="small" className="text-ui-fg-subtle">
                {merchant_center.status === "active"
                  ? t("googleYouTube.connected")
                  : merchant_center.status === "pending"
                  ? t("googleYouTube.pending")
                  : t("googleYouTube.notConnected")}
              </Text>
            </div>
          </div>

          {merchant_center.account_id && (
            <div>
              <Text size="small" weight="plus" className="mb-1">
                {t("googleYouTube.merchantCenter.accountId")}
              </Text>
              <Text size="small" className="text-ui-fg-subtle font-mono">
                {merchant_center.account_id}
              </Text>
            </div>
          )}

          {merchant_center.last_sync && (
            <div>
              <Text size="small" weight="plus" className="mb-1">
                {t("googleYouTube.merchantCenter.lastSync")}
              </Text>
              <Text size="small" className="text-ui-fg-subtle">
                {new Date(merchant_center.last_sync).toLocaleString("it-IT")}
              </Text>
            </div>
          )}

          {merchant_center.products_synced !== undefined && (
            <div>
              <Text size="small" weight="plus" className="mb-1">
                {t("googleYouTube.merchantCenter.productsSynced")}
              </Text>
              <Text size="small" className="text-ui-fg-subtle">
                {merchant_center.products_synced}
              </Text>
            </div>
          )}

          <Button
            variant="secondary"
            size="small"
            onClick={handleSync}
            isLoading={isSyncing}
          >
            {t("googleYouTube.merchantCenter.syncProducts")}
          </Button>
        </div>
      ) : (
        <Text className="text-ui-fg-subtle" size="small">
          {t("googleYouTube.notConnected")}
        </Text>
      )}
    </div>
  )
}


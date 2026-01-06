import { Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useGoogleAdsConversions } from "../../../hooks/api/google"

export const ConversionsDashboard = () => {
  const { t } = useTranslation()
  const conversionsData = useGoogleAdsConversions()
  // Handle different data formats
  const conversions = conversionsData?.conversions || conversionsData?.data || conversionsData
  const isPending = conversionsData?.isPending || false
  const isError = conversionsData?.isError || false

  return (
    <div className="bg-ui-bg-subtle rounded-lg p-6">
      <Heading level="h3" className="mb-4">
        {t("googleYouTube.conversions.title")}
      </Heading>

      {isPending ? (
        <Text className="text-ui-fg-subtle" size="small">
          {t("general.loading") || "Caricamento..."}
        </Text>
      ) : isError ? (
        <Text className="text-ui-fg-error" size="small">
          {t("googleYouTube.errors.connectionFailed")}
        </Text>
      ) : conversions ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              {t("googleYouTube.conversions.total")}
            </Text>
            <Text size="large" weight="plus">
              {conversions.total || 0}
            </Text>
          </div>
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              {t("googleYouTube.conversions.today")}
            </Text>
            <Text size="large" weight="plus">
              {conversions.today || 0}
            </Text>
          </div>
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              {t("googleYouTube.conversions.thisWeek")}
            </Text>
            <Text size="large" weight="plus">
              {conversions.this_week || 0}
            </Text>
          </div>
          <div>
            <Text size="xsmall" className="text-ui-fg-subtle mb-1">
              {t("googleYouTube.conversions.thisMonth")}
            </Text>
            <Text size="large" weight="plus">
              {conversions.this_month || 0}
            </Text>
          </div>
        </div>
      ) : (
        <Text className="text-ui-fg-subtle" size="small">
          Nessun dato disponibile
        </Text>
      )}
    </div>
  )
}


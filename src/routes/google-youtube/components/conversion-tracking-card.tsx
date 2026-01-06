import { Heading, Text, Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export const ConversionTrackingCard = () => {
  const { t } = useTranslation()

  return (
    <div className="bg-ui-bg-subtle rounded-lg p-6 flex flex-col gap-y-4">
      <Heading level="h3">
        {t("googleYouTube.conversionTracking.title")}
      </Heading>
      <Text className="text-ui-fg-subtle" size="small">
        {t("googleYouTube.conversionTracking.description")}
      </Text>
      <Button variant="secondary" size="small" asChild>
        <Link to="/google-youtube/conversion-tracking">
          {t("googleYouTube.conversionTracking.start")}
        </Link>
      </Button>
    </div>
  )
}


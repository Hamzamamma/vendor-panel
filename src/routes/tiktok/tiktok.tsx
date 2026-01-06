import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDashboardExtension } from "../../extensions"
import { SingleColumnPage } from "../../components/layout/pages"

export const TikTok = () => {
  const { t } = useTranslation()
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("tiktok.details.before"),
        after: getWidgets("tiktok.details.after"),
      }}
      hasOutlet={false}
    >
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h2">{t("tiktok.domain")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {t("tiktok.description")}
            </Text>
          </div>
        </div>
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            {t("tiktok.comingSoon")}
          </Text>
        </div>
      </Container>
    </SingleColumnPage>
  )
}

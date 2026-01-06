import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDashboardExtension } from "../../extensions"
import { SingleColumnPage } from "../../components/layout/pages"

export const Instagram = () => {
  const { t } = useTranslation()
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("instagram.details.before"),
        after: getWidgets("instagram.details.after"),
      }}
      hasOutlet={false}
    >
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading level="h2">{t("instagram.domain")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {t("instagram.description")}
            </Text>
          </div>
        </div>
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            {t("instagram.comingSoon")}
          </Text>
        </div>
      </Container>
    </SingleColumnPage>
  )
}

import { Container, Heading, Text, Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { NotConnected } from "./components/not-connected"
import { Connected } from "./components/connected"
import { useGoogleAccount } from "../../hooks/api/google"
import { SingleColumnPage } from "../../components/layout/pages"
import { useDashboardExtension } from "../../extensions"
import { ExclamationCircle } from "@medusajs/icons"

const getStatus = (account: any) => {
  if (!account) return "not connected"

  if (account.status === "pending") return "pending"

  return "connected"
}

export const GoogleYouTube = () => {
  const { t } = useTranslation()
  const { getWidgets } = useDashboardExtension()
  const accountData = useGoogleAccount()
  
  // Handle different data formats: data could be the account directly or contain google_account
  const google_account = accountData?.google_account || accountData?.data || accountData
  const isPending = accountData?.isPending || false
  const isError = accountData?.isError || false
  const error = accountData?.error

  const status = getStatus(google_account)

  if (isError) {
    return (
      <SingleColumnPage
        widgets={{
          before: getWidgets("google_youtube.details.before"),
          after: getWidgets("google_youtube.details.after"),
        }}
        hasOutlet={false}
      >
        <div className="mx-auto w-full max-w-[850px] flex flex-col gap-y-4">
          <div className="flex items-center justify-between px-6 py-4 bg-ui-bg-subtle rounded-lg">
            <div>
              <Heading level="h2">{t("googleYouTube.domain")}</Heading>
              <Text className="text-ui-fg-subtle" size="small">
                {t("googleYouTube.description")}
              </Text>
            </div>
          </div>
          <Container className="p-0 w-full">
            <div className="px-6 py-6 flex flex-col items-center justify-center text-center gap-y-4">
              <ExclamationCircle className="w-12 h-12 text-ui-fg-error" />
              <div>
                <Heading level="h3" className="mb-2">
                  {t("googleYouTube.errors.connectionFailed")}
                </Heading>
                <Text className="text-ui-fg-subtle" size="small">
                  {error?.message || t("general.error")}
                </Text>
              </div>
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                {t("general.retry") || "Riprova"}
              </Button>
            </div>
          </Container>
        </div>
      </SingleColumnPage>
    )
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("google_youtube.details.before"),
        after: getWidgets("google_youtube.details.after"),
      }}
      hasOutlet={false}
    >
      <div className="mx-auto w-full max-w-[850px] flex flex-col gap-y-3">
        <div className="flex items-center justify-between px-6 py-4 bg-ui-bg-subtle rounded-lg">
          <div>
            <Heading level="h2">{t("googleYouTube.domain")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {t("googleYouTube.description")}
            </Text>
          </div>
        </div>
        <Container className="p-0 w-full">
          <div className="px-6 py-4">
            {isPending ? (
              <div className="flex items-center justify-center py-12">
                <Text className="text-ui-fg-subtle">{t("general.loading") || "Caricamento..."}</Text>
              </div>
            ) : !google_account ? (
              <NotConnected />
            ) : (
              <Connected status={status} account={google_account} />
            )}
          </div>
        </Container>
      </div>
    </SingleColumnPage>
  )
}


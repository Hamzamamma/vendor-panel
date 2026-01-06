import { Button, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useConnectGoogleAccount } from "../../../hooks/api/google"
import { useState } from "react"

export const NotConnected = () => {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useConnectGoogleAccount()
  const [authUrl, setAuthUrl] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      const response = await mutateAsync({
        redirect_uri: window.location.origin + "/admin/auth/google/callback",
      })
      
      if (response?.auth_url) {
        window.location.href = response.auth_url
      } else {
        setAuthUrl(response?.auth_url || null)
      }
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-center text-center flex-col py-8">
        <Heading level="h2" className="mb-2">
          {t("googleYouTube.title")}
        </Heading>
        <Text className="text-ui-fg-subtle" size="small">
          {t("googleYouTube.configureDescription")}
        </Text>
      </div>

      <div className="bg-ui-bg-subtle rounded-lg p-6">
        <Heading level="h3" className="mb-4">
          {t("googleYouTube.configureStore")}
        </Heading>
        <Text className="text-ui-fg-subtle mb-6" size="small">
          {t("googleYouTube.configureDescription")}
        </Text>

        <div className="flex flex-col gap-y-4">
          <Button
            variant="primary"
            size="large"
            isLoading={isPending}
            onClick={handleConnect}
            className="w-full"
          >
            {t("googleYouTube.connectAccount")}
          </Button>
        </div>
      </div>
    </div>
  )
}


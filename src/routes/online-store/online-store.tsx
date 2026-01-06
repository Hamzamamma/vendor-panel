import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ArrowUpRightOnBox, Globe, CheckCircle, XCircle, Clock, Clipboard, Check } from "@medusajs/icons"
import { useMe } from "../../hooks/api/users"
import { MEDUSA_STOREFRONT_URL } from "../../lib/storefront"
import { SingleColumnPageSkeleton } from "../../components/common/skeleton/skeleton"
import { SingleColumnPage } from "../../components/layout/pages"
import { ImageAvatar } from "../../components/common/image-avatar"
import { useDashboardExtension } from "../../extensions"
import { useState } from "react"
import { toast } from "@medusajs/ui"

export const OnlineStore = () => {
  const { t } = useTranslation()
  const { seller, isPending, isError, error } = useMe()
  const { getWidgets } = useDashboardExtension()
  const [copied, setCopied] = useState(false)

  if (isPending || !seller) {
    return <SingleColumnPageSkeleton sections={1} />
  }

  if (isError) {
    throw error
  }

  const storeUrl = seller.handle
    ? `${MEDUSA_STOREFRONT_URL}/vendor/${seller.handle}`
    : null

  const handleCopyUrl = async () => {
    if (storeUrl) {
      await navigator.clipboard.writeText(storeUrl)
      setCopied(true)
      toast.success(t("onlineStore.urlCopied"))
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusIcon = () => {
    if (seller.store_status === "ACTIVE") {
      return <CheckCircle className="w-4 h-4 text-ui-tag-green-icon" />
    } else if (seller.store_status === "SUSPENDED") {
      return <Clock className="w-4 h-4 text-ui-tag-orange-icon" />
    } else {
      return <XCircle className="w-4 h-4 text-ui-tag-red-icon" />
    }
  }

  const getStatusBadgeColor = () => {
    if (seller.store_status === "ACTIVE") {
      return "green"
    } else if (seller.store_status === "SUSPENDED") {
      return "orange"
    } else {
      return "red"
    }
  }

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("online_store.details.before"),
        after: getWidgets("online_store.details.after"),
      }}
      hasOutlet={false}
    >
      <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-y-6 px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">{t("onlineStore.domain")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {t("onlineStore.description")}
            </Text>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Information Card */}
          <Container className="p-0">
            <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
              <div className="flex flex-col gap-y-4">
                <Text size="small" weight="plus" className="text-ui-fg-subtle">
                  {t("onlineStore.storeInfo")}
                </Text>
                <div className="flex items-start gap-x-4">
                  {seller.photo && (
                    <ImageAvatar src={seller.photo} size={16} rounded />
                  )}
                  <div className="flex flex-col gap-y-2 flex-1">
                    <div>
                      <Heading level="h3" className="mb-1">
                        {seller.name || t("onlineStore.unnamedStore")}
                      </Heading>
                      {seller.description && (
                        <Text size="small" className="text-ui-fg-subtle">
                          {seller.description}
                        </Text>
                      )}
                    </div>
                    <div className="flex items-center gap-x-2">
                      {getStatusIcon()}
                      <Badge color={getStatusBadgeColor()} size="2xsmall">
                        {seller.store_status === "ACTIVE"
                          ? t("onlineStore.status.active")
                          : seller.store_status === "SUSPENDED"
                          ? t("onlineStore.status.suspended")
                          : t("onlineStore.status.inactive")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>

          {/* Store URL Card */}
          <Container className="p-0">
            <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
              <div className="flex flex-col gap-y-4">
                <Text size="small" weight="plus" className="text-ui-fg-subtle">
                  {t("onlineStore.storeUrl")}
                </Text>
                {storeUrl ? (
                  <div className="flex flex-col gap-y-3">
                    <div className="flex items-center gap-x-2">
                      <div className="flex-1 bg-ui-bg-subtle border border-ui-border-base rounded-md px-3 py-2.5">
                        <Text size="small" className="font-mono text-ui-fg-base break-all">
                          {storeUrl}
                        </Text>
                      </div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={handleCopyUrl}
                        className="flex-shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Clipboard className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        size="small"
                        asChild
                      >
                        <a
                          href={storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-x-2"
                        >
                          <Globe className="w-4 h-4" />
                          {t("onlineStore.visitStore")}
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        asChild
                      >
                        <a
                          href={storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-x-2"
                        >
                          <ArrowUpRightOnBox className="w-4 h-4" />
                          {t("onlineStore.openInNewTab")}
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-ui-bg-subtle border border-ui-border-base rounded-md px-4 py-3">
                    <Text size="small" className="text-ui-fg-subtle">
                      {t("onlineStore.noStoreUrl")}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </Container>

          {/* Quick Actions Card */}
          <Container className="p-0 md:col-span-2">
            <div className="bg-ui-bg-base border border-ui-border-base rounded-lg p-6">
              <div className="flex flex-col gap-y-4">
                <Text size="small" weight="plus" className="text-ui-fg-subtle">
                  {t("onlineStore.quickActions")}
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    asChild
                  >
                    <a href="/settings/store" className="flex items-center gap-x-2">
                      {t("onlineStore.customizeStore")}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </SingleColumnPage>
  )
}


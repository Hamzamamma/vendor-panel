import { Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { CheckCircle, MinusCircle } from "@medusajs/icons"
import { useStoreRequirements } from "../../../hooks/api/google"
import { useMe } from "../../../hooks/api/users"
import { Link } from "react-router-dom"

export const OnboardingChecklist = ({ account }: { account: any }) => {
  const { t } = useTranslation()
  const requirementsData = useStoreRequirements()
  // Handle different data formats
  const requirements = requirementsData?.requirements || requirementsData?.data || requirementsData || {}
  const requirementsPending = requirementsData?.isPending || false
  const { seller } = useMe()

  const checklist = [
    {
      id: "googleAccount",
      label: t("googleYouTube.checklist.googleAccount"),
      completed: !!account?.google_account_id,
    },
    {
      id: "merchantCenter",
      label: t("googleYouTube.checklist.merchantCenter"),
      completed: !!account?.merchant_center_id,
    },
    {
      id: "storeRequirements",
      label: t("googleYouTube.checklist.storeRequirements"),
      completed: false,
      subItems: [
        {
          id: "paymentMethod",
          label: t("googleYouTube.checklist.paymentMethod"),
          completed: requirements?.has_payment_method || false,
        },
        {
          id: "createStore",
          label: t("googleYouTube.checklist.createStore"),
          completed: !!seller?.handle,
        },
        {
          id: "removePassword",
          label: t("googleYouTube.checklist.removePassword"),
          completed: requirements?.password_removed || false,
        },
      ],
    },
    {
      id: "refundPolicy",
      label: t("googleYouTube.checklist.refundPolicy"),
      completed: requirements?.has_refund_policy || false,
    },
  ]

  const completedCount = checklist.filter((item) => {
    if (item.subItems) {
      return item.subItems.every((sub) => sub.completed)
    }
    return item.completed
  }).length

  const totalCount = checklist.length

  return (
    <div className="bg-ui-bg-subtle rounded-lg p-6">
      <Heading level="h3" className="mb-4">
        {t("googleYouTube.configureStore")}
      </Heading>
      <Text className="text-ui-fg-subtle mb-4" size="small">
        {t("googleYouTube.configureDescription")}
      </Text>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Text size="small" weight="plus">
            {t("googleYouTube.activitiesCompleted", {
              completed: completedCount,
              total: totalCount,
            })}
          </Text>
        </div>
        <div className="w-full h-2 bg-ui-bg-base rounded-full overflow-hidden"><div className="h-full bg-ui-fg-interactive rounded-full" style={{ width: `${(completedCount / totalCount) * 100}%` }} /></div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-y-3">
        {checklist.map((item) => {
          const isCompleted = item.subItems
            ? item.subItems.every((sub) => sub.completed)
            : item.completed

          return (
            <div key={item.id} className="flex flex-col gap-y-2">
              <div className="flex items-start gap-x-3">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-ui-fg-base mt-0.5 flex-shrink-0" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-ui-fg-muted mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <Text
                    size="small"
                    className={isCompleted ? "" : "text-ui-fg-subtle"}
                  >
                    {item.label}
                  </Text>
                  {item.id === "storeRequirements" && (
                    <Text
                      size="xsmall"
                      className="text-ui-fg-muted mt-1 block"
                    >
                      {t("googleYouTube.checklist.storeRequirementsDescription")}
                    </Text>
                  )}
                  {item.id === "refundPolicy" && (
                    <Text
                      size="xsmall"
                      className="text-ui-fg-muted mt-1 block"
                    >
                      {t("googleYouTube.checklist.refundPolicyDescription")}
                    </Text>
                  )}
                </div>
              </div>

              {/* Sub-items */}
              {item.subItems && (
                <div className="ml-8 flex flex-col gap-y-2">
                  {item.subItems.map((subItem) => (
                    <div key={subItem.id} className="flex items-center gap-x-2">
                      {subItem.completed ? (
                        <CheckCircle className="w-4 h-4 text-ui-fg-base" />
                      ) : (
                        <MinusCircle className="w-4 h-4 text-ui-fg-muted" />
                      )}
                      <Text
                        size="xsmall"
                        className={
                          subItem.completed ? "" : "text-ui-fg-subtle"
                        }
                      >
                        {subItem.label}
                      </Text>
                      {subItem.id === "paymentMethod" && !subItem.completed && (
                        <Link
                          to="/settings/store"
                          className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-xs ml-2"
                        >
                          Gestisci
                        </Link>
                      )}
                      {subItem.id === "createStore" && !subItem.completed && (
                        <Link
                          to="/online-store"
                          className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-xs ml-2"
                        >
                          Gestisci
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


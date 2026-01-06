import {
  Buildings,
  ChevronDownMini,
  CogSixTooth,
  CurrencyDollar,
  MinusMini,
  ReceiptPercent,
  ShoppingCart,
  Tag,
  Users,
  Component,
  Globe,
} from "@medusajs/icons"
import { Divider, Text, clx } from "@medusajs/ui"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { useTranslation } from "react-i18next"

import { Skeleton } from "../../common/skeleton"
import { INavItem, NavItem } from "../../layout/nav-item"
import { Shell } from "../../layout/shell"

import { useLocation } from "react-router-dom"
import { useMe } from "../../../hooks/api"

import { StripeIcon } from "../../../assets/icons/Stripe"
import { GoogleIcon } from "../../../assets/icons/Google"
import { TikTokIcon } from "../../../assets/icons/TikTok"
import { FacebookIcon } from "../../../assets/icons/Facebook"
import { InstagramIcon } from "../../../assets/icons/Instagram"
import { GoogleAnalyticsIcon } from "../../../assets/icons/GoogleAnalytics"
import { ImageAvatar } from "../../common/image-avatar"
export const MainLayout = () => {
  return (
    <Shell>
      <MainSidebar />
    </Shell>
  )
}

const MainSidebar = () => {
  return (
    <aside className="flex flex-1 flex-col justify-between overflow-y-auto">
      <div className="flex flex-1 flex-col">
        <div className="bg-ui-bg-subtle sticky top-0">
          <Header />
          <div className="px-3">
            <Divider variant="dashed" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-1 flex-col">
            <CoreRouteSection />
            <ExtensionRouteSection />
          </div>
        </div>
      </div>
    </aside>
  )
}

const Header = () => {
  const { seller } = useMe()

  const name = seller?.name || ""
  const fallback = seller?.photo || "M"

  return (
    <div className="w-full p-3 p-0.5 pr-2 bg-ui-bg-subtle grid w-full grid-cols-[24px_1fr_15px] items-center gap-x-3">
      {fallback ? (
        <div className="w-7 h-7">
          <ImageAvatar src={seller?.photo || "/logo.svg"} size={7} rounded />
        </div>
      ) : (
        <Skeleton className="h-6 w-6 rounded-md" />
      )}
      <div className="block overflow-hidden text-left">
        {name ? (
          <Text
            size="small"
            weight="plus"
            leading="compact"
            className="truncate"
          >
            {name}
          </Text>
        ) : (
          <Skeleton className="h-[9px] w-[120px]" />
        )}
      </div>
    </div>
  )
}

const useCoreRoutes = (): Omit<INavItem, "pathname">[] => {
  const { t } = useTranslation()

  return [
    {
      icon: <Component />,
      label: "Dashboard",
      to: "/dashboard",
    },
    {
      icon: <Globe />,
      label: t("onlineStore.domain"),
      to: "/online-store",
    },
    {
      icon: <ShoppingCart />,
      label: t("orders.domain"),
      to: "/orders",
      items: [
        // TODO: Enable when domin is introduced
        // {
        //   label: t("draftOrders.domain"),
        //   to: "/draft-orders",
        // },
      ],
    },
    {
      icon: <Tag />,
      label: t("products.domain"),
      to: "/products",
      items: [
        {
          label: t("collections.domain"),
          to: "/collections",
        },
        {
          label: t("categories.domain"),
          to: "/categories",
        },
        // TODO: Enable when domin is introduced
        // {
        //   label: t("giftCards.domain"),
        //   to: "/gift-cards",
        // },
      ],
    },
    {
      icon: <Buildings />,
      label: t("inventory.domain"),
      to: "/inventory",
      items: [
        {
          label: t("reservations.domain"),
          to: "/reservations",
        },
      ],
    },
    {
      icon: <Users />,
      label: t("customers.domain"),
      to: "/customers",
      items: [
        {
          label: t("customerGroups.domain"),
          to: "/customer-groups",
        },
      ],
    },
    {
      icon: <ReceiptPercent />,
      label: t("promotions.domain"),
      to: "/promotions",
      items: [
        {
          label: t("campaigns.domain"),
          to: "/campaigns",
        },
      ],
    },
    {
      icon: <CurrencyDollar />,
      label: t("priceLists.domain"),
      to: "/price-lists",
    },
    {
      icon: <CogSixTooth />,
      label: t("app.nav.settings.header"),
      to: "/settings",
    },
  ]
}

const useExtensionRoutes = (): Omit<INavItem, "pathname">[] => {
  const { t } = useTranslation()

  return [
    {
      icon: <GoogleIcon />,
      label: t("googleYouTube.domain"),
      to: "/google-youtube",
    },
    {
      icon: <StripeIcon />,
      label: "Stripe Connect",
      to: "/stripe-connect",
    },
    {
      icon: <TikTokIcon />,
      label: t("tiktok.domain"),
      to: "/tiktok",
    },
    {
      icon: <FacebookIcon />,
      label: t("facebook.domain"),
      to: "/facebook",
    },
    {
      icon: <InstagramIcon />,
      label: t("instagram.domain"),
      to: "/instagram",
    },
    {
      icon: <GoogleAnalyticsIcon />,
      label: t("googleAnalytics.domain"),
      to: "/google-analytics",
    },
  ]
}


const CoreRouteSection = () => {
  const coreRoutes = useCoreRoutes()

  return (
    <nav className="flex flex-col gap-y-1 py-3">
      {coreRoutes.map((route) => {
        return <NavItem key={route.to} {...route} />
      })}
    </nav>
  )
}

const ExtensionRouteSection = () => {
  const extensionRoutes = useExtensionRoutes()
  const { t } = useTranslation()

  if (!extensionRoutes.length) return null

  return (
    <div>
      <div className="px-3">
        <Divider variant="dashed" />
      </div>
      <div className="flex flex-col gap-y-1 py-3">
        <RadixCollapsible.Root defaultOpen>
          <div className="px-4">
            <RadixCollapsible.Trigger asChild className="group/trigger">
              <button className="text-ui-fg-subtle flex w-full items-center justify-between px-2">
                <Text size="xsmall" weight="plus" leading="compact">
                  {t("app.nav.common.extensions")}
                </Text>
                <div className="text-ui-fg-muted">
                  <ChevronDownMini className="group-data-[state=open]/trigger:hidden" />
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                </div>
              </button>
            </RadixCollapsible.Trigger>
          </div>
          <RadixCollapsible.Content>
            <nav className="flex flex-col gap-y-0.5 py-1 pb-4">
              {extensionRoutes.map((route) => {
                return <NavItem key={route.to} {...route} />
              })}
            </nav>
          </RadixCollapsible.Content>
        </RadixCollapsible.Root>
      </div>
    </div>
  )
}


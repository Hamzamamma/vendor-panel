import { Container, Heading, Text } from "@medusajs/ui"
import { OnboardingRow } from "./onboarding-row"
import { useUpdateOnboarding } from "../../../hooks/api"
import { useEffect } from "react"

type DashboardProps = {
  products: boolean
  locations_shipping: boolean
  store_information: boolean
  stripe_connect: boolean
}

export const DashboardOnboarding = ({
  products,
  locations_shipping,
  store_information,
  // stripe_connect,
}: DashboardProps) => {
  const { mutateAsync } = useUpdateOnboarding()

  useEffect(() => {
    mutateAsync()
  }, [])

  return (
    <div className="mx-auto w-full max-w-[850px] flex flex-col gap-y-3">
      <div className="flex items-center justify-between px-6 py-4 bg-ui-bg-subtle rounded-lg">
        <div>
          <Heading>Benvenuto nel marketplace Mercur</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Completa questi passaggi per iniziare a vendere sul marketplace
          </Text>
        </div>
      </div>
      <Container className="p-0 w-full">
        <div className="px-6 py-4">
          <OnboardingRow
            label="Completa le informazioni del negozio"
            state={store_information}
            link="/settings/store"
            buttonLabel="Gestisci"
          />
          {/* <OnboardingRow
            label='Configura account Stripe Connect'
            state={stripe_connect}
            link='/stripe-connect'
            buttonLabel='Configura'
          /> */}
          <OnboardingRow
            label="Configura Località e Spedizioni"
            state={locations_shipping}
            link="/settings/locations"
            buttonLabel="Configura"
          />
          <OnboardingRow
            label="Aggiungi prodotti e inizia a vendere"
            state={products}
            link="/products/create"
            buttonLabel="Aggiungi"
          />
        </div>
      </Container>
    </div>
  )
}

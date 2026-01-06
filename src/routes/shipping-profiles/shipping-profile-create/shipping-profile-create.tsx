import { RouteFocusModal } from "../../../components/modals"
import { CreateShippingProfileForm } from "./components/create-shipping-profile-form"

export function ShippingProfileCreate() {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateShippingProfileForm />
    </RouteFocusModal>
  )
}

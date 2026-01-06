import { RouteFocusModal } from "../../../components/modals"
import { TaxRegionCreateForm } from "./components/tax-region-create-form"

export const TaxRegionCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <TaxRegionCreateForm />
    </RouteFocusModal>
  )
}

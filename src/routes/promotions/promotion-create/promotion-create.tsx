import { RouteFocusModal } from "../../../components/modals"
import { CreatePromotionForm } from "./components/create-promotion-form/create-promotion-form"

export const PromotionCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreatePromotionForm />
    </RouteFocusModal>
  )
}

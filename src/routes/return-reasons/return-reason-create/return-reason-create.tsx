import { RouteFocusModal } from "../../../components/modals"
import { ReturnReasonCreateForm } from "./components/return-reason-create-form"

export const ReturnReasonCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <ReturnReasonCreateForm />
    </RouteFocusModal>
  )
}

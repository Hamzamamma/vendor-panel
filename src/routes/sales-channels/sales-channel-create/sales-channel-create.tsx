import { RouteFocusModal } from "../../../components/modals"
import { CreateSalesChannelForm } from "./components/create-sales-channel-form"

export const SalesChannelCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateSalesChannelForm />
    </RouteFocusModal>
  )
}

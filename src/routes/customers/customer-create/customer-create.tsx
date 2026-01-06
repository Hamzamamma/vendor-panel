import { RouteFocusModal } from "../../../components/modals"
import { CreateCustomerForm } from "./components/create-customer-form"

export const CustomerCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateCustomerForm />
    </RouteFocusModal>
  )
}

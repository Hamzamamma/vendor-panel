import { RouteFocusModal } from "../../../components/modals"
import { CreateCustomerGroupForm } from "./components/create-customer-group-form"

export const CustomerGroupCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateCustomerGroupForm />
    </RouteFocusModal>
  )
}

import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { AddCustomersForm } from "./components/add-customers-form"

export const CustomerGroupAddCustomers = () => {
  const { id } = useParams()

  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <AddCustomersForm customerGroupId={id!} />
    </RouteFocusModal>
  )
}

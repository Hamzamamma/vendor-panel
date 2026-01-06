import { RouteFocusModal } from "../../../components/modals"
import { CreateLocationForm } from "./components/create-location-form"

export const LocationCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateLocationForm />
    </RouteFocusModal>
  )
}

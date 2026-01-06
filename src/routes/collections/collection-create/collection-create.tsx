import { RouteFocusModal } from "../../../components/modals"
import { CreateCollectionForm } from "./components/create-collection-form"

export const CollectionCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateCollectionForm />
    </RouteFocusModal>
  )
}

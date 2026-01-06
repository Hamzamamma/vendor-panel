import { RouteFocusModal } from "../../../components/modals"
import { OrganizeCategoryForm } from "./components/organize-category-form/organize-category-form"

export const CategoryOrganize = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <OrganizeCategoryForm />
    </RouteFocusModal>
  )
}

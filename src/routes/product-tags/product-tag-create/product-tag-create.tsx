import { RouteFocusModal } from "../../../components/modals"
import { ProductTagCreateForm } from "./components/product-tag-create-form"

export const ProductTagCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <ProductTagCreateForm />
    </RouteFocusModal>
  )
}

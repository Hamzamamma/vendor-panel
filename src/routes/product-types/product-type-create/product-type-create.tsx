import { RouteFocusModal } from "../../../components/modals"
import { CreateProductTypeForm } from "./components/create-product-type-form"

export const ProductTypeCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateProductTypeForm />
    </RouteFocusModal>
  )
}

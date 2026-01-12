import { useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useProduct } from "../../../hooks/api/products"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductOptionSection } from "./components/product-option-section"
import { ProductOrganizationSection } from "./components/product-organization-section"
import { ProductVariantSection } from "./components/product-variant-section"

import { useDashboardExtension } from "../../../extensions"
import { ProductAttributeSection } from "./components/product-attribute-section/product-attribute-section"

export const ProductDetail = () => {
  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(id!, {
    fields:
      "*variants.inventory_items,*categories,attribute_values.*,attribute_values.attribute.*",
  })

  const { getWidgets } = useDashboardExtension()

  const after = getWidgets("product.details.after")
  const before = getWidgets("product.details.before")
  const sideAfter = getWidgets("product.details.side.after")
  const sideBefore = getWidgets("product.details.side.before")

  if (isLoading || !product) {
    return <TwoColumnPageSkeleton mainSections={4} sidebarSections={3} />
  }

  if (isError) {
    throw error
  }

  return (
    <>
      <TwoColumnPage
        widgets={{
          after,
          before,
          sideAfter,
          sideBefore,
        }}
        data={product}
      >
        <TwoColumnPage.Main>
          <ProductGeneralSection product={product} />
          <ProductMediaSection product={product} />
          <ProductVariantSection product={product} />
        </TwoColumnPage.Main>
        <TwoColumnPage.Sidebar>
          {/* <ProductShippingProfileSection product={product} /> */}
          <ProductOrganizationSection product={product} />
          <ProductAttributeSection product={product} />
          <ProductOptionSection product={product} />
        </TwoColumnPage.Sidebar>
      </TwoColumnPage>
    </>
  )
}

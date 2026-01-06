import { Container, Heading, Input } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { MagnifyingGlass } from "@medusajs/icons"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { debounce } from "lodash"

import { _DataTable } from "../../../../../components/table/data-table/data-table"
import { useOrders } from "../../../../../hooks/api/orders"
import { useOrderTableColumns } from "../../../../../hooks/table/columns/use-order-table-columns"
import { useOrderTableQuery } from "../../../../../hooks/table/query/use-order-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useSearchParams } from "react-router-dom"
import { useOrderTableFilters } from "../../../../../hooks/table/filters"

const PAGE_SIZE = 10

export const OrderListTable = () => {
  const { t } = useTranslation()
  const { raw, searchParams } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  })

  const [params, setSearchParams] = useSearchParams()
  const order_status = params.get("order_status") || ""
  const searchQuery = params.get("q") || ""

  const [search, setSearch] = useState<string>(searchQuery)

  // Sync search state with URL params
  useEffect(() => {
    setSearch(searchQuery)
  }, [searchQuery])

  // Debounced search handler
  const debouncedOnChange = useCallback(
    debounce((value: string) => {
      if (!value) {
        setSearchParams((prev) => {
          prev.delete("q")
          return prev
        })
      } else {
        setSearchParams((prev) => {
          prev.set("q", value)
          return prev
        })
      }
    }, 500),
    [setSearchParams]
  )

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedOnChange(value)
  }

  const { orders, count, isError, error, isLoading } = useOrders(
    {
      fields: "*customer,+payment_status,*split_order_payment",
    },
    undefined,
    {
      order_status,
      created_at: searchParams.created_at,
      updated_at: searchParams.updated_at,
      sort: searchParams.order,
      q: searchParams.q,
    }
  )

  const offset = searchParams.offset || 0

  const processedOrders = orders?.slice(offset, offset + PAGE_SIZE)
  const processedCount = count < orders?.length ? count : orders?.length || 0

  const columns = useOrderTableColumns({})
  const filters = useOrderTableFilters()

  const { table } = useDataTable({
    data: processedOrders ?? [],
    columns,
    enablePagination: true,
    count: processedCount,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="mx-auto w-full max-w-[850px] flex flex-col gap-y-3">
      <div className="flex items-center justify-between px-6 py-4 gap-x-4">
        <Heading className="text-4xl font-semibold">{t("orders.domain")}</Heading>
        <div className="flex-1 max-w-[300px]">
          <div className="relative">
            <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-ui-fg-muted w-4 h-4" />
            <Input
              type="search"
              size="small"
              value={search}
              onChange={handleSearchChange}
              placeholder={t("general.search")}
              className="pl-8"
            />
          </div>
        </div>
      </div>
      <Container className="p-0 w-full border-0 shadow-none">
        <_DataTable
          columns={columns}
          table={table}
          pagination
          filters={filters}
          navigateTo={(row) => `/orders/${row.original.id}`}
          count={processedCount}
          isLoading={isLoading}
          pageSize={PAGE_SIZE}
          orderBy={[
            {
              key: "display_id",
              label: t("orders.fields.displayId"),
            },
            {
              key: "created_at",
              label: t("fields.createdAt"),
            },
            {
              key: "updated_at",
              label: t("fields.updatedAt"),
            },
          ]}
          queryObject={raw}
          noRecords={{
            message: t("orders.list.noRecordsMessage"),
          }}
        />
      </Container>
    </div>
  )
}

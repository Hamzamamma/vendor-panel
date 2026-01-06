import { Container, Heading, Tooltip } from "@medusajs/ui"

export const ReviewCustomerSection = ({ customer }: { customer?: any }) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Cliente</Heading>
      </div>
      <div className="px-6 py-4 grid grid-cols-2 text-sm">
        <p>Nome</p>
        <p>{customer ? `${customer.first_name} ${customer.last_name}` : "-"}</p>
      </div>
      <div className="px-6 py-4 grid grid-cols-2 text-sm">
        <p>Email</p>
        <Tooltip content={<p>{customer ? `${customer.email}` : "-"}</p>}>
          <p className="truncate">{customer ? `${customer.email}` : "-"}</p>
        </Tooltip>
      </div>
    </Container>
  )
}

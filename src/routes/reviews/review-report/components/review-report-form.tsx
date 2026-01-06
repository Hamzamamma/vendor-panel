import { useForm } from "react-hook-form"
import { Form } from "../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Select, Textarea, toast } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useCreateVendorRequest, useUpdateRequest } from "../../../../hooks/api"

const reasonList = [
  "Il commento della recensione non è veritiero",
  "Il commento della recensione è offensivo",
  "Il commento della recensione è volgare",
  "Altro",
]

const ReviewReplySchema = z.object({
  reason: z.string().min(1, { message: "Seleziona un motivo" }),
  comment: z.string().optional(),
})

export const ReviewReportForm = ({ request }: { request?: any }) => {
  const { handleSuccess } = useRouteModal()
  const { id } = useParams()

  const isEditing = !!request

  const reviewReason = request?.data?.reason.split(" comment: ")[0] || ""
  const reviewComment = request?.data?.reason.split(" comment: ")[1] || ""

  const defaultValues = isEditing
    ? {
        reason: reviewReason,
        comment: reviewComment,
      }
    : {
        reason: "",
        comment: "",
      }

  const form = useForm<z.infer<typeof ReviewReplySchema>>({
    defaultValues,
    resolver: zodResolver(ReviewReplySchema),
  })

  const { mutateAsync: createRequest, isPending } = useCreateVendorRequest()
  const { mutateAsync: updateRequest, isPending: isUpdating } =
    useUpdateRequest(id!)

  const handleSubmit = form.handleSubmit(async (data) => {
    const reason = `${data.reason}${data.comment ? ` comment: ${data.comment}` : ""}`

    if (isEditing) {
      await updateRequest(
        {
          request: {
            type: "review_remove",
            data: {
              review_id: request.data.review_id,
              reason,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success("Richiesta aggiornata", {
              description: "Attendi una risposta dal moderatore.",
            })
            handleSuccess(`/requests/reviews`)
          },
        }
      )
    } else {
      await createRequest(
        {
          request: {
            type: "review_remove",
            data: {
              review_id: id,
              reason,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success("Recensione segnalata", {
              description: "Attendi una risposta dal moderatore.",
            })
            handleSuccess(`/reviews/${id}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    }
  })

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{isEditing ? "Modifica Richiesta" : "Segnala Recensione"}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description>
          {isEditing
            ? "Modifica la richiesta di segnalazione della recensione."
            : "Segnala la recensione del cliente."}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <RouteDrawer.Form form={form}>
        <RouteDrawer.Body>
          <Form.Field
            control={form.control}
            name="reason"
            render={({ field: { ref, onChange, ...field } }) => {
              return (
                <Form.Item className="mt-4">
                  <Form.Label>Motivo</Form.Label>
                  <Form.Control>
                    <Select {...field} onValueChange={onChange}>
                      <Select.Trigger ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {reasonList.map((reason, index) => (
                          <Select.Item
                            key={`select-option-${index}`}
                            value={reason}
                          >
                            {reason}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="comment"
            render={({ field }) => {
              return (
                <Form.Item className="mt-8">
                  <Form.Label>Commento</Form.Label>
                  <Form.Control>
                    <Textarea autoComplete="off" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
      </RouteDrawer.Form>
      <RouteDrawer.Footer>
        <Button
          onClick={handleSubmit}
          className="px-6"
          isLoading={isPending || isUpdating}
        >
          {isEditing ? "Aggiorna Richiesta" : "Segnala recensione"}
        </Button>
      </RouteDrawer.Footer>
    </RouteDrawer>
  )
}

import { useForm } from "react-hook-form"
import { Form } from "../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Textarea, toast } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useReview, useUpdateReview } from "../../../../hooks/api/review"

const ReviewReplySchema = z.object({
  seller_note: z.string().min(1),
})

export const ReviewReplyForm = () => {
  const { handleSuccess } = useRouteModal()
  const { id } = useParams()

  const { review } = useReview(id!)

  const form = useForm<z.infer<typeof ReviewReplySchema>>({
    defaultValues: {
      seller_note: review.seller_note || "",
    },
    resolver: zodResolver(ReviewReplySchema),
  })

  const { mutateAsync, isPending } = useUpdateReview(id!)
  //@ts-ignore
  const handleSubmit = form.handleSubmit(async (data, { deleting }) => {
    if (deleting) {
      await mutateAsync(
        {
          seller_note: "",
        },
        {
          onSuccess: () => {
            toast.success("Risposta eliminata")
            handleSuccess(`/reviews/${id}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    } else {
      await mutateAsync(
        {
          seller_note: data.seller_note,
        },
        {
          onSuccess: () => {
            toast.success("Risposta inviata")
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
          <Heading>{review.seller_note ? "Modifica Risposta" : "Rispondi"}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description>
          {review.seller_note
            ? "Modifica la tua risposta alla recensione del cliente."
            : "Rispondi alla recensione del cliente."}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <RouteDrawer.Form form={form}>
        <RouteDrawer.Body>
          <Form.Field
            control={form.control}
            name="seller_note"
            render={({ field }) => {
              return (
                <Form.Item>
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
        {review.seller_note && (
          <Button
            className="px-6"
            variant="secondary"
            //@ts-ignore
            onClick={() => handleSubmit({ deleting: true })}
          >
            Elimina risposta
          </Button>
        )}
        <Button
          //@ts-ignore
          onClick={() => handleSubmit({ deleting: false })}
          className="px-6"
          isLoading={isPending}
        >
          {review.seller_note ? "Salva" : "Rispondi"}
        </Button>
      </RouteDrawer.Footer>
    </RouteDrawer>
  )
}

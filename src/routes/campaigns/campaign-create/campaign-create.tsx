import { RouteFocusModal } from "../../../components/modals"
import { CreateCampaignForm } from "./components/create-campaign-form"

export const CampaignCreate = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <CreateCampaignForm />
    </RouteFocusModal>
  )
}

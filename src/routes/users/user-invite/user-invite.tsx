import { RouteFocusModal } from "../../../components/modals"
import { InviteUserForm } from "./components/invite-user-form/invite-user-form"

export const UserInvite = () => {
  return (
    <RouteFocusModal contentClassName="!max-w-[850px] !mx-auto">
      <InviteUserForm />
    </RouteFocusModal>
  )
}

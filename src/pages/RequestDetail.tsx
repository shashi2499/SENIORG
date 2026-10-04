import { useParams, useNavigate } from "react-router-dom";
import { FileQuestion, Lock } from "lucide-react";
import { EmptyState } from "@/components/ds/States";
import { RequestRecord } from "@/components/record/RequestRecord";
import { FamilyRequestView } from "@/components/FamilyViews";
import { getVisibleRequests, isFamilyRole } from "@/lib/visibility";
import { useCurrentPerson, useStore } from "@/store/StoreContext";

export function RequestDetail() {
  const { requestId } = useParams();
  const { state } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const request = requestId ? state.requests[requestId] : undefined;

  if (!request) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="We can't find that request"
        body="It may have been cleared when the demo was reset."
        action={{ label: "Go to your requests", onClick: () => navigate("/requests") }}
      />
    );
  }

  // Do not bypass visibility: spouses, family and the desk see only what they may.
  if (person && !getVisibleRequests(state.requests, person).some((r) => r.id === request.id)) {
    return (
      <EmptyState
        icon={Lock}
        title="This request isn't available to you"
        body={person.role === "COORDINATOR" ? "The member has taken it back, so it's no longer with the desk." : "It hasn't been shared with you."}
        action={{ label: "Back to home", onClick: () => navigate("/home") }}
      />
    );
  }

  if (person && isFamilyRole(person)) return <FamilyRequestView request={request} person={person} />;

  return <RequestRecord request={request} />;
}

import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { Phone, PhoneCall, MessageSquare, HandHelping, ShieldAlert, Undo2, ChevronRight, Headset } from "lucide-react";
import { Sheet } from "./ui/Sheet";
import { DIRECT_NAME, DIRECT_TAGLINE, DirectMark } from "./direct/SeniorGDirect";
import { Button } from "./ui/Button";
import { HandoverPanel, canHandOver, canTakeBack } from "./HandoverPanel";
import { useCurrentPerson, useStore } from "@/store/StoreContext";

const INFO_OPTIONS = [
  {
    id: "call",
    label: "Call SeniorG now",
    icon: Phone,
    info: "Demo: a SeniorG coordinator would call you within a minute. No real call is placed in this prototype.",
  },
  {
    id: "callback",
    label: "Request a call-back",
    icon: PhoneCall,
    info: "Demo: call-back requested. The desk would call you back within 30 minutes, any time of day.",
  },
  {
    id: "message",
    label: "Chat with SeniorG",
    icon: MessageSquare,
    info: "Demo: messaging is simulated here. For a request in progress, choose 'Have SeniorG handle this'.",
  },
  {
    id: "pause",
    label: "Pause — I'm not sure about a call",
    icon: ShieldAlert,
    info: "Stop. SeniorG and your bank never ask for your password, OTP or UPI PIN. Hang up, and call someone you trust.",
  },
];

type Mode = "handover" | "takeback";

type View =
  | { kind: "menu" }
  | { kind: "info"; text: string }
  | { kind: "pick" }
  | { kind: "confirm"; requestId: string; mode: Mode }
  | { kind: "done"; requestId: string; mode: Mode };

export function HelpSheet() {
  const { state, dispatch } = useStore();
  const person = useCurrentPerson();
  const navigate = useNavigate();
  const match = useMatch("/requests/:requestId");
  const [view, setView] = useState<View>({ kind: "menu" });
  const open = state.ui.helpSheetOpen;

  const contextRequest = match?.params.requestId ? state.requests[match.params.requestId] : undefined;
  const mine = Object.values(state.requests).filter((r) => canHandOver(r, person));

  function close() {
    setView({ kind: "menu" });
    dispatch({ type: "TOGGLE_HELP_SHEET", open: false });
  }

  const optionClass =
    "flex min-h-[60px] w-full items-center gap-3 rounded-tile border border-line px-4 py-3 text-left font-semibold text-ink transition hover:bg-sand";

  let body: React.ReactNode;

  if (view.kind === "info") {
    body = (
      <div className="space-y-4">
        <div className="rounded-card bg-infotint p-4 text-body-sm text-ink">{view.text}</div>
        <Button variant="secondary" fullWidth onClick={() => setView({ kind: "menu" })}>
          Back
        </Button>
      </div>
    );
  } else if (view.kind === "pick") {
    body = (
      <div className="space-y-3">
        <p className="text-body-sm text-ink-2">Which request should SeniorG handle?</p>
        <ul className="space-y-2">
          {mine.map((r) => (
            <li key={r.id}>
              <button
                className={optionClass}
                onClick={() => setView({ kind: "confirm", requestId: r.id, mode: "handover" })}
              >
                <span className="flex-1">
                  {r.title}
                  <span className="block text-meta font-normal text-ink-2">{r.id}</span>
                </span>
                <ChevronRight size={18} className="text-ink-2" />
              </button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" fullWidth onClick={() => setView({ kind: "menu" })}>
          Back
        </Button>
      </div>
    );
  } else if (view.kind === "confirm" && person && state.requests[view.requestId]) {
    const mode = view.mode;
    const requestId = view.requestId;
    body = (
      <HandoverPanel
        request={state.requests[requestId]}
        mode={mode}
        person={person}
        onCancel={() => setView({ kind: "menu" })}
        onDone={() => setView({ kind: "done", requestId, mode })}
      />
    );
  } else if (view.kind === "done") {
    const handed = view.mode === "handover";
    const requestId = view.requestId;
    body = (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-card bg-brand-tint p-4 text-brand-dark">
          <Headset size={22} className="mt-0.5 shrink-0" />
          <p className="font-semibold">
            {handed ? "Your request has been handed to SeniorG." : "You have taken the request back."}
          </p>
        </div>
        <Button
          fullWidth
          onClick={() => {
            close();
            navigate(`/requests/${requestId}`);
          }}
        >
          View request
        </Button>
        <Button variant="text" fullWidth onClick={close}>
          Close
        </Button>
      </div>
    );
  } else {
    const showHandOver = !!person && !!contextRequest && canHandOver(contextRequest, person);
    const showTakeBack = !!person && !!contextRequest && canTakeBack(contextRequest, person);
    body = (
      <ul className="space-y-2">
        {showHandOver && contextRequest && (
          <li>
            <button
              className={`${optionClass} border-brand/40 bg-brand-tint`}
              onClick={() => setView({ kind: "confirm", requestId: contextRequest.id, mode: "handover" })}
            >
              <HandHelping size={20} className="text-brand" />
              <span>
                Have SeniorG handle this
                <span className="block text-meta font-normal text-ink-2">{contextRequest.title}</span>
              </span>
            </button>
          </li>
        )}
        {showTakeBack && contextRequest && (
          <li>
            <button
              className={`${optionClass} border-brand/40 bg-brand-tint`}
              onClick={() => setView({ kind: "confirm", requestId: contextRequest.id, mode: "takeback" })}
            >
              <Undo2 size={20} className="text-brand" />
              <span>
                Take this request back
                <span className="block text-meta font-normal text-ink-2">{contextRequest.title}</span>
              </span>
            </button>
          </li>
        )}
        {!showHandOver && mine.length > 0 && (
          <li>
            <button className={optionClass} onClick={() => setView({ kind: "pick" })}>
              <HandHelping size={20} className="text-brand" />
              Have SeniorG handle a request
            </button>
          </li>
        )}
        {INFO_OPTIONS.map(({ id, label, icon: Icon, info }) => (
          <li key={id}>
            <button className={optionClass} onClick={() => setView({ kind: "info", text: info })}>
              <Icon size={20} className="text-brand" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Sheet open={open} onClose={close} title={DIRECT_NAME} subtitle={`${DIRECT_TAGLINE} — talk to a person, or hand something over.`}>
      <p className="mb-5 flex items-center gap-3 rounded-tile bg-brand-tint px-4 py-3 text-body-sm text-brand-dark">
        <DirectMark size="sm" /> A person is available now · anytime, 24 hours (demo)
      </p>
      {body}
    </Sheet>
  );
}

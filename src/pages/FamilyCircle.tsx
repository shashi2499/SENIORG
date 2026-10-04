import { useState } from "react";
import { Check, UserPlus, ShieldCheck, Eye, Lock, ClipboardList, CalendarClock, FolderOpen, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ds/Avatar";
import { Photo } from "@/components/ds/Photo";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ConfirmButton } from "@/components/ui/ConfirmButton";
import { ComingSoon } from "@/components/ComingSoon";
import { useCurrentPerson, useStore } from "@/store/StoreContext";
import type { PermissionArea, PermissionScope, Person } from "@/types/entities";

const AREAS: { key: PermissionArea; label: string; short: string; hint: string; icon: typeof Eye }[] = [
  { key: "REQUEST_STATUS", label: "See request status", short: "Request status", hint: "Status only: no prices, notes or history", icon: ClipboardList },
  { key: "REMINDERS", label: "See reminders", short: "Reminders", hint: "Title, due date and status", icon: CalendarClock },
  { key: "DOCUMENTS", label: "View documents", short: "Documents", hint: "Document index only, never the document itself", icon: FolderOpen },
  { key: "PAYMENTS", label: "Help pay", short: "Payments", hint: "Amount and payment status; a payer can pay (demo)", icon: IndianRupee },
];

const SCOPES: { value: PermissionScope; label: string }[] = [
  { value: "NONE", label: "Not shared" },
  { value: "SELECTED", label: "Selected" },
  { value: "ALL", label: "All" },
];

export function FamilyCircle() {
  const { state, dispatch } = useStore();
  const me = useCurrentPerson();
  const [managing, setManaging] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [form, setForm] = useState({ name: "", relation: "", role: "FAMILY_VIEWER" as Person["role"] });

  if (!me || (me.role !== "MEMBER" && me.role !== "SPOUSE")) {
    return <ComingSoon title="Family Circle" note="Family settings belong to the household members." />;
  }

  const family = Object.values(state.people).filter((p) => p.role === "FAMILY_VIEWER" || p.role === "FAMILY_PAYER");
  const household = state.household.memberIds.map((id) => state.people[id]).filter(Boolean);

  // Only grants made by the person using this page. Spouses are independent:
  // Asha's grants and Suresh's grants are separate and never mixed.
  const myGrants = (member: Person) => (member.permissions ?? []).filter((p) => p.grantedBy === me.id);
  const scopeOf = (member: Person, area: PermissionArea) => myGrants(member).find((g) => g.area === area);

  // Items I can share: my own requests, my own reminders, documents I can see.
  const items: Record<PermissionArea, { id: string; label: string }[]> = {
    REQUEST_STATUS: Object.values(state.requests).filter((r) => r.createdBy === me.id).map((r) => ({ id: r.id, label: `${r.title} · ${r.id}` })),
    PAYMENTS: Object.values(state.requests).filter((r) => r.createdBy === me.id).map((r) => ({ id: r.id, label: `${r.title} · ${r.id}` })),
    REMINDERS: Object.values(state.reminders).filter((r) => r.ownerId === me.id).map((r) => ({ id: r.id, label: r.title })),
    DOCUMENTS: Object.values(state.documents).filter((d) => d.visibleTo.includes(me.id)).map((d) => ({ id: d.id, label: d.name })),
    EMERGENCY_INFO: [],
  };

  function setScope(member: Person, area: PermissionArea, scope: PermissionScope, itemIds: string[] = []) {
    dispatch({ type: "SET_FAMILY_PERMISSION", memberId: member.id, grantedBy: me!.id, area, scope, itemIds });
  }

  function toggleItem(member: Person, area: PermissionArea, id: string) {
    const current = scopeOf(member, area)?.itemIds ?? [];
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    setScope(member, area, "SELECTED", next);
  }

  function summary(member: Person, area: PermissionArea) {
    const g = scopeOf(member, area);
    if (!g || g.scope === "NONE") return "Not shared";
    return g.scope === "ALL" ? "All" : `Selected (${g.itemIds.length})`;
  }

  const managed = managing ? state.people[managing] : undefined;

  function invite() {
    if (!form.name.trim()) return;
    dispatch({
      type: "ADD_FAMILY_MEMBER",
      person: {
        id: `P-FAM-${Date.now()}`,
        name: form.name.trim(),
        role: form.role,
        relation: form.relation.trim() || "Family",
        avatarInitials: form.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
        permissions: [],
      },
    });
    setForm({ name: "", relation: "", role: "FAMILY_VIEWER" });
    setInviting(false);
  }

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
        className="overflow-hidden rounded-card bg-brand-deep text-white shadow-hero"
      >
        <div className="grid lg:grid-cols-[1.3fr_1fr]">
          <div className="p-6 sm:p-8">
            <p className="flex items-center gap-2 text-body-sm font-semibold text-accent">
              <ShieldCheck size={18} /> Family circle
            </p>
            <h1 className="mt-2 font-serif text-title leading-tight sm:text-display">You're in control.</h1>
            <p className="mt-2 max-w-md text-body text-white/85">
              Nothing is shared by default — not even with family in the same city. You choose what each person sees, and you can change it at any time.
            </p>
            {me.role === "SPOUSE" && <p className="mt-3 text-body-sm text-white/75">These are your own settings. Your spouse manages theirs separately.</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              {household.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-2 rounded-pill bg-white/10 py-1 pl-1 pr-3 text-body-sm">
                  <Avatar initials={p.avatarInitials} seed={p.id} size={30} />
                  <span className="font-semibold">{p.id === me.id ? "You" : p.name.split(" ")[0]}</span>
                  <span className="text-white/70">· own account, private by default</span>
                </span>
              ))}
            </div>
          </div>
          <Photo slot="chai" className="hidden h-full min-h-[16rem] lg:block" rounded="rounded-none" />
        </div>
      </motion.section>

      <section className="space-y-4">
        <h2 className="font-serif text-section text-ink">Who you share with</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {family.map((member) => {
            const grantedAreas = AREAS.filter((a) => (scopeOf(member, a.key)?.scope ?? "NONE") !== "NONE");
            const first = member.name.split(" ")[0];
            return (
              <article key={member.id} className="surface-primary flex flex-col p-5">
                <div className="flex items-center gap-4">
                  <Avatar initials={member.avatarInitials} seed={member.id} size={52} />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-section leading-tight text-ink">{member.name}</p>
                    <p className="text-body-sm text-ink-2">
                      {member.relation}
                      {member.city ? ` · ${member.city}` : ""} · {member.role === "FAMILY_PAYER" ? "can help pay" : "viewer"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-body-sm font-semibold text-ink-2">{grantedAreas.length ? `What ${first} can see` : `${first} sees nothing yet`}</p>
                <ul className="mt-2 grid grid-cols-2 gap-2">
                  {AREAS.map((area) => {
                    const g = scopeOf(member, area.key);
                    const granted = (g?.scope ?? "NONE") !== "NONE";
                    const Icon = area.icon;
                    return (
                      <li
                        key={area.key}
                        className={["flex items-start gap-2 rounded-tile p-3", granted ? "bg-brand-tint text-brand-dark" : "bg-sand text-ink-3"].join(" ")}
                      >
                        <Icon size={17} className="mt-0.5 shrink-0" />
                        <span className="min-w-0">
                          <span className={["block text-body-sm font-semibold", granted ? "text-ink" : "text-ink-2"].join(" ")}>{area.short}</span>
                          <span className="inline-flex items-center gap-1 text-tag">
                            {granted ? <Eye size={12} /> : <Lock size={12} />} {summary(member, area.key)}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="md" onClick={() => setManaging(member.id)}>
                    Choose what {first} sees
                  </Button>
                  {grantedAreas.length > 0 && (
                    <ConfirmButton
                      onConfirm={() => dispatch({ type: "REVOKE_FAMILY_ACCESS", memberId: member.id, grantedBy: me.id })}
                      confirmLabel="Click again to revoke"
                      className="flex min-h-[48px] items-center gap-1.5 rounded-pill px-4 text-body-sm font-semibold text-critical hover:bg-critical-tint"
                    >
                      Revoke all access
                    </ConfirmButton>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <button onClick={() => setInviting(true)} className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-card border-2 border-dashed border-line text-body font-semibold text-brand-dark hover:bg-sand">
          <UserPlus size={20} /> Invite a family member (demo)
        </button>
      </section>

      <Sheet open={!!managed} onClose={() => setManaging(null)} title={managed ? `What ${managed.name.split(" ")[0]} can see` : "Access"}>
        {managed && (
          <div className="space-y-5">
            {AREAS.map((area) => {
              const g = scopeOf(managed, area.key);
              const scope = g?.scope ?? "NONE";
              return (
                <div key={area.key} className="space-y-2">
                  <div>
                    <p className="font-semibold text-ink">{area.label}</p>
                    <p className="text-meta text-ink-2">{area.hint}</p>
                  </div>
                  <div className="flex gap-1.5" role="group" aria-label={area.label}>
                    {SCOPES.map((s) => (
                      <button
                        key={s.value}
                        aria-pressed={scope === s.value}
                        onClick={() => setScope(managed, area.key, s.value, g?.itemIds ?? [])}
                        className={[
                          "min-h-[44px] flex-1 rounded-pill border px-2 text-body-sm font-semibold",
                          scope === s.value ? "border-brand bg-brand text-white" : "border-card-border text-ink-2 hover:bg-ink/5",
                        ].join(" ")}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {scope === "SELECTED" && (
                    <ul className="space-y-2 rounded-tile bg-sand p-3">
                      {items[area.key].length === 0 && <li className="text-meta text-ink-2">Nothing to select yet.</li>}
                      {items[area.key].map((it) => (
                        <li key={it.id}>
                          <label className="flex items-start gap-2 text-body-sm text-ink">
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={g?.itemIds.includes(it.id) ?? false}
                              onChange={() => toggleItem(managed, area.key, it.id)}
                            />
                            {it.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <Button fullWidth onClick={() => setManaging(null)}>
              Done
            </Button>
          </div>
        )}
      </Sheet>

      <Sheet open={inviting} onClose={() => setInviting(false)} title="Invite a family member">
        <div className="space-y-4">
          <p className="text-body-sm text-ink-2">Demo only: no invitation is sent. They start with no access.</p>
          <label className="block space-y-1 text-body-sm font-semibold text-ink">
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="min-h-[52px] w-full rounded-tile border border-line px-4 text-body font-normal focus:border-brand"
              placeholder="e.g. Anil Kulkarni"
            />
          </label>
          <label className="block space-y-1 text-body-sm font-semibold text-ink">
            Relation
            <input
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
              className="min-h-[52px] w-full rounded-tile border border-line px-4 text-body font-normal focus:border-brand"
              placeholder="e.g. Nephew"
            />
          </label>
          <div className="flex gap-2" role="group" aria-label="Role">
            {(["FAMILY_VIEWER", "FAMILY_PAYER"] as const).map((r) => (
              <button
                key={r}
                aria-pressed={form.role === r}
                onClick={() => setForm({ ...form, role: r })}
                className={[
                  "flex-1 rounded-card border px-3 py-2 text-sm font-semibold",
                  form.role === r ? "border-brand bg-brand text-white" : "border-card-border text-ink-2",
                ].join(" ")}
              >
                {r === "FAMILY_VIEWER" ? "Viewer" : "Payer"}
              </button>
            ))}
          </div>
          <Button fullWidth disabled={!form.name.trim()} onClick={invite}>
            Add to Family Circle (demo)
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

/**
 * Tracks which ARK conversations have already had a project brief delivered
 * to the inbox.
 *
 * `createArkLead` is idempotent, so a resubmit of the same conversation
 * returns created=false. Gating the email purely on that flag would mean a
 * brief is only ever emailed on the FIRST submit - so if that first send
 * failed (Resend outage, rate limit, network blip) the brief could never be
 * retried, and the client would still receive a 200.
 *
 * Instead we remember successful deliveries. A repeat submit is only skipped
 * when we have positive evidence that the inbox already has it.
 *
 * State lives on globalThis behind a Symbol.for key: in dev each route is
 * bundled separately, so a module-level Map would give /conversations and
 * /leads separate copies.
 */
type DeliveryState = Set<string>;

const KEY = Symbol.for("ark.brief-email.delivered");

function store(): DeliveryState {
  const globals = globalThis as typeof globalThis & { [KEY]?: DeliveryState };

  if (!globals[KEY]) {
    globals[KEY] = new Set<string>();
  }

  return globals[KEY];
}

export function wasBriefEmailed(conversationId: string): boolean {
  return store().has(conversationId);
}

export function markBriefEmailed(conversationId: string): void {
  store().add(conversationId);
}

/**
 * Allow a failed delivery to be retried. Called only when delivery failed,
 * so a genuine duplicate-submit is still suppressed.
 */
export function clearBriefEmailed(conversationId: string): void {
  store().delete(conversationId);
}

/**
 * Drop entries once a conversation can no longer be resubmitted. Keeps the
 * set bounded across a long-running process.
 */
export function forgetBriefEmail(conversationId: string): void {
  store().delete(conversationId);
}
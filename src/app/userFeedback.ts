export interface UserFeedback { success(message: string): void; error(message: string): void; }
export class PaneFeedback implements UserFeedback {
  private set(message: string, isError = false) { const node = document.querySelector<HTMLElement>("#status"); if (node) { node.textContent = message; node.dataset.state = isError ? "error" : "success"; } }
  success(message: string) { this.set(message); }
  error(message: string) { this.set(message, true); }
}

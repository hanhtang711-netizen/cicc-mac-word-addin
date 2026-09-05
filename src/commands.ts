import { registerCommandHandlers } from "./app/commandHandlers";
if (typeof Office !== "undefined") Office.onReady(() => registerCommandHandlers());

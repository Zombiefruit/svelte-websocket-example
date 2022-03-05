export async function connectToServer() {
  const ws = new WebSocket("ws://localhost:8080/ws");
  return new Promise<WebSocket>((resolve, reject) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer);
        resolve(ws);
      }
    }, 10);
  });
}

export function getOrCreateCursorFor(messageBody: any) {
  const sender = messageBody.sender;
  const existing = document.querySelector(`[data-sender='${sender}']`);
  if (existing) {
    return existing;
  }

  const template = document.getElementById("cursor");
  const cursor = (template as any)?.content?.firstElementChild.cloneNode(true);
  const svgPath = cursor.getElementsByTagName("path")[0];

  cursor.setAttribute("data-sender", sender);
  svgPath.setAttribute("fill", `hsl(${messageBody.color}, 50%, 50%)`);
  document.body.appendChild(cursor);

  return cursor;
}

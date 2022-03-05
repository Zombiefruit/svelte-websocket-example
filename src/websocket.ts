import { WebsocketMessage } from '../universal/types';

export async function connectToServer() {
	const ws = new WebSocket('ws://localhost:8080/ws');
	return new Promise<WebSocket>((resolve) => {
		const timer = setInterval(() => {
			if (ws.readyState === 1) {
				clearInterval(timer);
				resolve(ws);
			}
		}, 10);
	});
}

export function getOrCreateCursorFor(messageBody: WebsocketMessage): HTMLElement {
	const sender = messageBody.sender;
	const existing = document.querySelector(`[data-sender='${sender}']`) as HTMLElement;

	if (existing) {
		return existing;
	}

	const template = document.getElementById('cursor') as HTMLTemplateElement;
	const cursor = template?.content.firstElementChild?.cloneNode(true) as HTMLElement;
	const svgPath = cursor?.getElementsByTagName('path')[0];

	if (sender) {
		cursor.setAttribute('data-sender', sender);
	}

	svgPath.setAttribute('fill', `hsl(${messageBody.color}, 50%, 50%)`);
	document.body.appendChild(cursor);

	return cursor;
}

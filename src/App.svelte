<script lang="ts">
  import { onMount } from "svelte";
  import { connectToServer, getOrCreateCursorFor } from "./websocket";

  async function init() {
    const ws = await connectToServer();

    document.body.onmousemove = (evt) => {
      const messageBody = { x: evt.clientX, y: evt.clientY };
      ws.send(JSON.stringify(messageBody));
    };

    ws.onmessage = (webSocketMessage) => {
      const messageBody = JSON.parse(webSocketMessage.data);
      const cursor = getOrCreateCursorFor(messageBody);
      cursor.style.transform = `translate(${messageBody.x}px, ${messageBody.y}px)`;
    };
  }

  onMount(() => {
    init();
  });
</script>

<template id="cursor">
  <svg viewBox="0 0 16.3 24.7" class="cursor">
    <path
      stroke="#000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-miterlimit="10"
      d="M15.6 15.6L.6.6v20.5l4.6-4.5 3.2 7.5 3.4-1.3-3-7.2z"
    />
  </svg>
</template>

<style>
  :global(body) {
    height: 100vh;
    margin: 0;
    background-color: aliceblue;
    overflow: hidden;
    cursor: none;
  }

  .cursor {
    width: 30px;
    transition: all ease;
  }
</style>

import { writable } from "svelte/store";
import type { RealtimeWritable } from "./realtimeStore";
import type { Game } from "$lib/types/game";

const gameStoreStore = writable<RealtimeWritable<Game>>(undefined);

export default {
  subscribe: gameStoreStore.subscribe,
  set: gameStoreStore.set,
};
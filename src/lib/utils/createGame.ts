import gameStoreStore from "$lib/stores/gameStoreStore";
import { RealtimeWritable, RealtimeWritableFactory } from "$lib/stores/realtimeStore";
import { GameState, type Game } from "$lib/types/game";

export async function createOrJoinGame(roomCode: string, playerId: string, playerName: string): Promise<RealtimeWritable<Game>> {
  console.log("createOrJoinGame", roomCode, playerId);
  const gameStore = await RealtimeWritableFactory<Game>(`games/${roomCode}`, {
    id: crypto.randomUUID(),
    players: [{
      id: playerId,
      name: playerName
    }],
    roomCode: roomCode,
    state: GameState.WAITING_FOR_PLAYERS,
    roundNum: 0,
    owner: playerId
  });

  console.log("About to commit")

  gameStore.commit({});

  gameStoreStore.set(gameStore);

  console.log({gameStore: gameStore.value});

  return gameStore;
}
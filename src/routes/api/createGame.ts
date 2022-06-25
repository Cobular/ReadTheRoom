import type { RequestEvent, RequestHandler } from "@sveltejs/kit";

export interface CreateGameRequest {
	playerName: string;
	gameCode: string;
}

/** @type {import('./__types/api/createGame').RequestHandler} */
export async function post({ request }: RequestEvent) {
	const data = await request.formData();

  console.log(data.get("playerName"));

  let playerName, roomCode;
  if ((playerName = data.get("playerName")) !== null && (roomCode = data.get("roomCode")) !== null) {
    // Tell the client that the game was made and it can join the game
    return {
      status: 200
    };
  }

  // Something has gone fucky
  return {
    status: 400,
  }
}

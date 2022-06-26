import type { Game, Player } from '$lib/types/game';
import { getAuth, signInAnonymously, updateProfile, type UserCredential } from 'firebase/auth';

export async function makeOrGetUser(playerName: string): Promise<UserCredential> {
	const auth = getAuth();

	const user = await signInAnonymously(auth);

	await updateProfile(user.user, {
		displayName: playerName
	});

	return user;
}

export function getPlayer(game: Game, uid: string): Player | undefined {
	return game.players.find((player) => player.id === uid);
}

export function getAsker(game: Game): Player {
	const num_players = game.players.length;
	const current_index = game.roundNum % num_players;

	return game.players[current_index];
}

export function getOwner(game: Game): Player | undefined {
	return game.players.find((player) => player.id === game.owner);
}

export function isPlayerAsker(game: Game, uid: string): boolean {
	const num_players = game.players.length;
	const current_index = game.roundNum % num_players;

	return game.players[current_index].id === uid;
}
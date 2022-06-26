<script lang="ts">
	import { createOrJoinGame } from '$lib/utils/createGame';
	import { getAuth, signInAnonymously, updateProfile } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { makeOrGetUser } from '$lib/utils/users';

	let roomCode: string;
	let roomCodeError: string | undefined = undefined;

	let playerName: string;

	async function handleSubmit(event: Event) {
		if (event.target === null || !(event.target instanceof HTMLFormElement)) {
			return;
		}

		if (roomCode.length < 4) {
			roomCodeError = 'Room code must be at least 4 characters long';
		} else {
			roomCodeError = undefined;
			const formData = new FormData(event.target);

			// Need to auth the user with firebase then redirect to the game page
			const auth = getAuth();
			try {
				let user = await makeOrGetUser(playerName);

				let res = await createOrJoinGame(roomCode, user.user.uid, playerName);

				if (res === false) {
					// Game is in progress
					roomCodeError = 'Game already in progress';
					return;
				}

				goto(`/game/${roomCode}`);
			} catch (error: any) {
				console.error(error);
				roomCodeError = error.message;
				return;
			}
		}
	}
</script>

{#if roomCodeError}
	<p class="error">{roomCodeError}</p>
{/if}

<form
	on:submit|preventDefault={handleSubmit}
	class="max-w-sm flex flex-col items-center m-auto justify-self-center rounded-md border-2 border-gray-300 p-2 mt-20"
>
	<label for="roomCode">Room Code</label>
	<input
		name="roomCode"
		placeholder="Room Code"
		bind:value={roomCode}
		minlength="4"
		required
		type="number"
		class="appearance-none rounded-sm border"
	/>

	<label for="playerName" class="pt-5">Player Name</label>
	<input name="playerName" placeholder="Name" bind:value={playerName} required class="appearance-none rounded-sm border" />

	<input type="submit" value="Join Game!" class="p-1 rounded-md" />
</form>

<style lang="scss">
	label {
		margin-bottom: 0.5rem;
	}
	input {
		margin-bottom: 0.5rem;
	}
</style>

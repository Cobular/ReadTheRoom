<script lang="ts">
	import { post } from '../../routes/api/createGame';
	import { getAuth, signInAnonymously, updateProfile } from 'firebase/auth';
	import type { AuthError } from 'firebase/auth';
	import authStore from '$lib/stores/authStore';

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
				let user = await signInAnonymously(auth);

				await updateProfile(user.user, {
					displayName: playerName
				})

				let response = await fetch('/api/createGame', {
					method: 'POST',
					body: new URLSearchParams({
						roomCode,
						playerName
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});

				if (response.ok) {
					window.location.href = `/game/${roomCode}`;
				} else {
					roomCodeError = 'Could not join room';
				}
			} catch (error: any) {
				console.error(error)
				roomCodeError = error.message;
				return;
			}
		}
	}
</script>

{#if roomCodeError}
	<p class="error">{roomCodeError}</p>
{/if}

<form on:submit|preventDefault={handleSubmit}>
	<label for="roomCode">Room Code</label>
	<input
		name="roomCode"
		placeholder="Room Code"
		bind:value={roomCode}
		minlength="4"
		required
		type="number"
	/>

	<label for="playerName">Player Name</label>
	<input name="playerName" placeholder="Name" bind:value={playerName} required />

	<input type="submit" value="Join Game" />
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	label {
		margin-bottom: 0.5rem;
	}
	input {
		margin-bottom: 0.5rem;
	}
	input[type='submit'] {
		margin-top: 0.5rem;
	}

	input:invalid {
		border: 2px dashed red;
	}
</style>

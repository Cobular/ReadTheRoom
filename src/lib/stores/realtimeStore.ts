import { writable, type Readable, type Writable } from 'svelte/store';
import { getDatabase, onValue, ref, type DatabaseReference, set, get } from 'firebase/database';
import { mergeDeep } from '$lib/utils/mergeDeep';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RealtimeWritable<T extends Record<string, any>> implements Readable<T> {
	private readonly docRef: DatabaseReference;
	private readonly svelteStore: Writable<T>;
	public readonly subscribe: Readable<T>['subscribe'];
	// The value of this store, always synchronized with the database
	public value: T;

	/// This constructor always populates the store with the contents of initial
	/// Will not itself ensure synchronization with the cloud
	private constructor(private readonly documentString: string, private readonly initial: T) {
		// Setup document references
		const db = getDatabase();
		this.docRef = ref(db, this.documentString);		

		// Setup the internal svelte store
		this.svelteStore = writable(this.initial);
		this.value = this.initial;
		// Fill this.value with the value of the store
		this.svelteStore.subscribe((value) => (this.value = value));
		this.subscribe = this.svelteStore.subscribe;
		
		// Pull down cloud data every time the store is updated
		onValue(this.docRef, (snapshot) => {
			const data = snapshot.val();
			if (data !== undefined) {
				this.svelteStore.set(data);
			}
		});
	}

	/// Create both a new RealtimeStore locally and a new document in RealtimeDB with the same initial value
	/// Will override the cloud instance if safe is true, otherwise it will throw if the document already exists
	public static async newFromInitial<T>(documentString: string, initial: T, safe = true): Promise<RealtimeWritable<T>> {
		// Setup the cloud store stuff
		const db = getDatabase();
		const docRef = ref(db, documentString);
		const snapshot = await get(docRef);

		// if we're in safe mode, and the document exists, throw
		if (safe === true && snapshot.exists())
			throw new Error(`Document ${documentString} already exists`);

		// Otherwise, create the document in the backend
		await set(docRef, initial);

		// Setup the local version of the store
		return new RealtimeWritable(documentString, initial);
	}

	/// Create a new RealtimeStore locally, taking the initial value from the cloud
	public static async newExistingStore<T>(documentString: string): Promise<RealtimeWritable<T>> {
		// Setup the cloud store stuff
		const db = getDatabase();
		const docRef = ref(db, documentString);
		const snapshot = await get(docRef);

		// Check if the cloud document exists
		if (snapshot.exists()) {
			// Setup the local version of the store
			return new RealtimeWritable(documentString, snapshot.val() as T);
		} else {
			throw new Error(`Document ${documentString} does not exist`);
		}
	}
	

	// Merge in data when new data arrives
	async commit(patch: Partial<T>) {
    const mergeResult = mergeDeep(this.value, patch);
		await set(this.docRef, mergeResult);

		const snapshot = await get(this.docRef);

		this.svelteStore.set(snapshot.val() as T);
	}

	async hard_set(newValue: T) {
		await set(this.docRef, newValue);
		this.svelteStore.set(newValue);
	}
}

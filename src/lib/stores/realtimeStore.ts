import { writable, type Readable, type Writable } from 'svelte/store';
import { getDatabase, onValue, ref, type DatabaseReference, set, get } from 'firebase/database';
import { mergeDeep } from '$lib/utils/mergeDeep';

/// Gets the content in the database, if any exists, then merges it with the default content before creating our copy of the content.
export async function RealtimeWritableFactory<T>(documentString: string, initial: T): Promise<RealtimeWritable<T>> {
	const db = getDatabase();
	const docRef = ref(db, documentString);

	const firstSnapshot = await get(docRef);

	// Initialize the database
	if (firstSnapshot.exists()) {
		const newValue = mergeDeep(firstSnapshot.val(), initial) as T;
		await set(docRef, newValue);
	} else {
		await set(docRef, initial);
	}

	// Ensure consistency between the database and the local copy
	const secondSnapshot = await (await get(docRef)).val();

	debugger;
	return new RealtimeWritable(documentString, secondSnapshot as T);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RealtimeWritable<T extends Record<string, any>> implements Readable<T> {
	private readonly docRef: DatabaseReference;
	private readonly svelteStore: Writable<T>;
	public readonly subscribe: Readable<T>['subscribe'];
	// The value of this store, always synchronized with the database
	public value: T;

	constructor(private readonly documentString: string, private readonly initial: T) {
		const db = getDatabase();
		this.docRef = ref(db, this.documentString);
		this.svelteStore = writable(this.initial);
		this.svelteStore.subscribe((value) => (this.value = value));

		this.subscribe = this.svelteStore.subscribe;
		this.value = this.initial;
		
		// Pull down cloud data every time the store is updated
		onValue(this.docRef, (snapshot) => {
			const data = snapshot.val();
			if (data !== undefined) {
				this.svelteStore.set(data);
			}
		});
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

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { getDatabase, onValue, ref, type DatabaseReference, set, get } from 'firebase/database';
import { mergeDeep } from '$lib/utils/mergeDeep';
import { get_store_value } from 'svelte/internal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RealtimeWritable<T extends Record<string, any>> implements Readable<T> {
	// @ts-ignore
	private docRef: DatabaseReference;
	// @ts-ignore
	private svelteStore: Writable<T>;
	// @ts-ignore
	public subscribe: Readable<T>['subscribe'];
	// The value of this store, always synchronized with the database
	// @ts-ignore
	public value: T;
	private connected = false;

	/// This constructor creates a new instance, reflecting the initial value of the database
	private constructor(private readonly docRefSupplier: () => DatabaseReference) {}

	public async new<T>(documentString: string): Promise<RealtimeWritable<T>> {
		const docRefSupplier = () => {
			// Setup document references
			const db = getDatabase();
			return ref(db, documentString);
		}
		return new RealtimeWritable(docRefSupplier);
	}

	public async connect() {
		if (this.connected) throw new Error("Already connected");
    this.connected = true;

		this.docRef = this.docRefSupplier();

		const contents = await get(this.docRef);
		const value: T = contents.val() as T;

		// Setup the internal svelte store to match the cloud
		this.svelteStore = writable(value);
		this.value = value;

		this.svelteStore.subscribe((value) => (this.value = value));
		this.subscribe = this.svelteStore.subscribe;

		// Pull down cloud data every time the store is updated, notifing subscribers
		onValue(this.docRef, (snapshot) => {
			const data = snapshot.val();
			if (data !== undefined) {
				this.svelteStore.set(data);
			}
		});
	}

	// Merge in data when new data arrives
	async commit(patch: Partial<T>) {
		if (!this.connected) throw new Error("Store has not been connected to firestore");

    const mergeResult = mergeDeep(this.value, patch);
		await set(this.docRef, mergeResult);

		const snapshot = await get(this.docRef);

		this.svelteStore.set(snapshot.val() as T);
	}

	async hard_set(newValue: T) {
		if (!this.connected) throw new Error("Store has not been connected to firestore");

		await set(this.docRef, newValue);
		this.svelteStore.set(newValue);
	}
}

class RealtimeWritableField<T extends Record<string, any>, K extends keyof T>
	implements Writable<T[K]>
{
  constructor(
		private readonly parent: RealtimeWritable<T>,
    private readonly key: K
  ) {
		this.derivedStore = derived(
			this.parent,
			(parentValue) => parentValue[this.key]
		);
		this.subscribe = this.derivedStore.subscribe;
	}

  private readonly derivedStore: Readable<T[K]>;
  public readonly subscribe;

	set(value: T[K]) {
    const patch: Partial<T> = {};
    patch[this.key] = value;
    this.parent.commit(patch);
  }
 
  update(updater: (value: T[K]) => T[K]) {
    const oldValue = get_store_value(this.derivedStore);
    this.set(updater(oldValue));
  }
}
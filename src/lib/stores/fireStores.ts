// https://lexoral.com/blog/svelte-firestore-binding/

import { DocumentReference, onSnapshot, setDoc } from 'firebase/firestore';
import type { PartialWithFieldValue } from 'firebase/firestore';
import { get_store_value } from 'svelte/internal';
import { derived, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FirestoreWritable<T extends Record<string, any>> implements Readable<T> {
	constructor(
		private readonly documentSupplier: () => DocumentReference<T>,
		private readonly initial: T,
		private readonly debounceDelayMs: number = 1000
	) {
		this.remoteStore = writable(this.initial);
		this.localStore = derived([this.remoteStore, this.stageStore], ([remote, stage]) => ({
			...remote,
			...stage
		}));
		this.subscribe = this.localStore.subscribe;
	}

	private connected = false;
	private readonly remoteStore: Writable<T>;
	private readonly stageStore: Writable<Partial<T>> = writable({});
	private readonly localStore: Readable<T>;
	public readonly subscribe: Readable<T>['subscribe'];

	connect() {
		if (this.connected) throw new Error('Already connected');
		this.connected = true;

		onSnapshot(this.documentSupplier(), (snapshot) => {
			const data = snapshot.data();
			if (data !== undefined) this.remoteStore.set({ ...this.initial, ...data });
		});

		let timer: NodeJS.Timeout | undefined = undefined;
		this.stageStore.subscribe((stageState) => {
			if (timer !== undefined) clearTimeout(timer);
			if (Object.keys(stageState).length === 0) return;
			timer = setTimeout(() => this.push(stageState), this.debounceDelayMs);
		});
	}

	async push(): Promise<void> {
		if (!this.connected) throw new Error('Store has not been connected to firestore');

		await setDoc(
			this.documentSupplier(),
			get_store_value(this.stageStore) as PartialWithFieldValue<T>,
			{ merge: true }
		);

		this.stageStore.set({});
	}

	commit(patch: Partial<T>) {
		this.stageStore.update((state) => ({ ...state, ...patch }));
	}

	private readonly fields: Partial<Record<keyof T, FirestoreWritableField<T, keyof T>>> = {};

	getField<K extends keyof T>(key: K): FirestoreWritableField<T, K> {
		return new FirestoreWritableField(this, key);
		if (!(key in this.fields)) this.fields[key] = new FirestoreWritableField(this, key);
		return this.fields[key] as FirestoreWritableField<T, K>;
	}
}

class FirestoreWritableField<T extends Record<string, unknown>, K extends keyof T>
	implements Writable<T[K]>
{
	constructor(private readonly parent: FirestoreWritable<T>, private readonly key: K) {
		this.derivedStore = derived(this.parent, (parentValue) => parentValue[this.key]);
		this.subscribe = this.derivedStore.subscribe;
		this.push = this.parent.push;
	}

	private readonly derivedStore: Readable<T[K]>;
	public readonly subscribe;
	public readonly push;

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

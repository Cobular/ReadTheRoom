export function isObject(item: unknown): item is object {
	return item !== undefined && typeof item === 'object' && !Array.isArray(item);
}

export function isArray(item: unknown): item is unknown[] {
	return item !== undefined && typeof item === 'object' && Array.isArray(item);
}

export function makeArrayUnique<T>(array: T[], prop: keyof T): unknown[] {
  const foundIds = new Set();
  return array.filter((item) => {
    const id = item[prop];
    if (foundIds.has(id)) {
      return false;
    }
    foundIds.add(id);
    return true;
  });
}

/**
 * Deep merge two objects. https://stackoverflow.com/a/34749873/5623598
 * @param target
 * @param ...sources
 */
export function mergeDeep<T>(target: Partial<T>, ...sources: Partial<T>[]): Partial<T> {
	if (!sources.length) return target;
	const source = sources.shift();

	console.log('isarray?', Array.isArray(target), target);

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				mergeDeep(target[key], source[key]);
			} else if (isArray(source[key]) && isArray(target[key])) {
        // We know the following will be safe as we just did the guard above
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const newArray = makeArrayUnique([...target[key], ...source[key]], 'id');

        Object.assign(target, { [key]: newArray });
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}

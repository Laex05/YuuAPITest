export const arrayUtils = {
  removeItemFromArray,
  removeItemAtIndexFromArray,
  getRandomItemFromArray,
  removeItemsFromArray,
  insertItemIntoArray,
  insertItemsIntoArray,
  shuffleArray,
  shuffleArrayInPlace,
}

function removeItemFromArray<t>(array: t[], item: t) {
  const itemIndex = array.indexOf(item);

  if (itemIndex >= 0) {
    array.splice(itemIndex, 1);
  }
}

function removeItemAtIndexFromArray<t>(array: t[], index: number) {
  if (index >= 0 && index < array.length) {
    array.splice(index, 1);
  }
}

function getRandomItemFromArray<t>(array: readonly t[]): t | undefined {
  if (array.length > 0) {
    const randomIndex = Math.floor(array.length * Math.random());

    return array[randomIndex];
  }
  else {
    return undefined;
  }
}

function removeItemsFromArray<t>(arrayToRemoveFrom: t[], arrayOfItemsToRemove: t[]) {
  arrayOfItemsToRemove.forEach((item) => {
    removeItemFromArray(arrayToRemoveFrom, item);
  });
}

/**
 * Randomly shuffle items from a given array, returned in a new array. Code courtesy of WaffleCopters, via "Fisher-Yates (Knuth) Shuffle Algorithm"
 * @param array to shuffle
 * @returns a new shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  return shuffleArrayInPlace([...array]);
}


/**
 * Randomly shuffle items inside a given array. Code courtesy of WaffleCopters, via "Fisher-Yates (Knuth) Shuffle Algorithm"
 * @param array to shuffle
 * @returns the original array
 */
function shuffleArrayInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}


/**
 * Inserts an item into an array, shifting the contents if necessary
 * @param array to insert the item into
 * @param item to insert
 * @param index at which to insert
 */
function insertItemIntoArray<t>(array: t[], item: t, index: number) {
  array.splice(index, 0, item);
}


/**
 * Inserts items into an array, shifting the contents if necessary
 * @param array to insert the item into
 * @param items to insert
 * @param index at which to insert
 */
function insertItemsIntoArray<t>(array: t[], items: t[], index: number) {
  array.splice(index, 0, ...items);
}
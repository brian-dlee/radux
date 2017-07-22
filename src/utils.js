/**
 * Converts object with namespaced keys to a nested object
 * e.g.
 * {                                               {
 *   globals/myGlobalActionType: [func]    ===>      globals: { myGlobalActionType: [func] },
 *   reducer1/mySecondActionType: [func2]  ===>      reducer1: { mySecondActionType: [func2] },
 * }                                               }
 * @param obj
 * @returns {{}}
 */
const convertDirectoryNotationToObject = obj => {
  const newObj = {};

  Object.keys(obj).forEach(key => {
    if (key.includes("/")) {
      const parts = key.split("/");
      const group = parts.shift();

      if (!newObj[group]) {
        newObj[group] = {};
      }

      if (parts[0].includes("/")) {
        throw `Action types deeper than two levels is not currently supported. Received ${key}.`;
      }

      newObj[group][parts.shift()] = obj[key];
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

export { convertDirectoryNotationToObject };

export default function filterUndefinedKeys( sourceObj: any): any {
    const keys = Object.keys(sourceObj);
    const updateObj = {};
    for (const key of keys) {
      const value = sourceObj[key];
      if (value !== undefined) {
        updateObj[key] = value;
      }
    }
    return updateObj;
}

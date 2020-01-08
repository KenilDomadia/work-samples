export default function filterNullKeys(sourceObj: any): any {
    const keys = Object.keys(sourceObj);
    const updateObj = {};
    for (const key of keys) {
        const value = sourceObj[key];
        if (value !== null) {
            updateObj[key] = value;
        }
    }
    return updateObj;
}

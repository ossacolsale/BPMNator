export class CheckerHelper {

    public static IsArrayOf(arr: any[], type: string = 'string', uniqueElements: boolean = true): boolean {
        try {
            for (let i of arr) {
                if (typeof(i) !== type) return false;
            }
            if (uniqueElements) {
                let prev = null;
                for (let i of arr.sort()) {
                    if (i === prev) return false;
                    prev = i;
                }
            }
            return true;
        } catch {
            return false;
        }
    }
}
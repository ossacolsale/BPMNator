import { TGoto } from "../entities/SharedTypes";

export class EntHelper {

    public static get IdFirstCharRegex (): RegExp {

        return /^[_A-Za-z]{1}$/;
    }

    public static get IdOtherCharsRegex (): RegExp {
        
        return /^[.\-_A-Za-z0-9]{1}$/;
    }

    public static CamelCase (aString: string): string {

        aString = aString.trim();
        let outAString = '';
        const words = aString.split(' ');
        for (let word of words) {
            if (word == ' ') continue;
            word = word.toLowerCase();
            outAString += word.substr(0,1).toUpperCase() + word.substr(1);
        }
        return outAString;
    }

    public static GetIdFromName (aName: string): string {
        aName = aName.trim();
        if (aName == '') return '_';
        else {
            let outAName = '';
            if (!this.IdFirstCharRegex.test(aName.substr(0,1))) {
                outAName += '_';
            }

            for (let i = 0; i < aName.length; ++i) {
                let i_char = aName.substr(i,1);
                if (this.IdOtherCharsRegex.test(i_char) || i_char == ' ') 
                    outAName += i_char;
                else outAName += '_';
            }

            return this.CamelCase(outAName);
        }
    }

    public static IsSingleGoto (goto: TGoto) {
        return (typeof(goto)==='string');
    }

    public static StrToStrArray (aStrOrStrArray: string | string[]): string[] {
        if (typeof(aStrOrStrArray) == 'string') aStrOrStrArray = [aStrOrStrArray];
        return aStrOrStrArray;
    }
}
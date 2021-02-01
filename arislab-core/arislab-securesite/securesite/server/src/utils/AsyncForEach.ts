
export class AsyncForEach {

    //foreach see:https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
    public static async foreach(array: any[], cb: any) {
        for (let index = 0; index < array.length; index++) {
            await cb(array[index], index, array);
        }
    }

}
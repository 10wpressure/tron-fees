export const sleep = (time: number): Promise<any> => new Promise((resolve) => setTimeout(resolve, time));

export const timeout = (time: number): Promise<Error> =>
    new Promise((resolve, reject) =>
        setTimeout(() => {
            reject(new Error('REQUEST_TIMEOUT_ERROR'));
        }, time)
    );

export const runUncritical = async <R>(context: any, func: (...args: any[]) => Promise<R>, ...args: any[]) => {
    const trials = 10;

    let result!: R;
    for (let trial = 0; trial < trials; trial++) {
        try {
            result = await func.apply(context, args);
            break;
        } catch (err) {
            if (trial === trials - 1) {
                console.log(`error`);
                throw err;
            } else {
                console.log(`Retrying, attempt: ${trial}`);
                await sleep(3000);
            }
        }
    }

    return result;
};
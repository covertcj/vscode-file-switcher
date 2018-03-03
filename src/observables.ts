import { Observable } from 'rxjs';

export const fromIterable = <T>(iterable: Iterable<T>): Observable<T> =>
    Observable.from(iterable as any);

export const gatherAsArray = async <T>(observable: Observable<T>): Promise<T[]> =>
    new Promise<T[]>(resolve => {
        const sub = observable.toArray().subscribe(next => {
            resolve(next);
            sub.unsubscribe();
        });
    });


export const debug = (message: string) => <T>(source: Observable<T>) =>
    source.do(
        next => console.log(`${message}`, next),
        err => console.error(`${message}`, err),
        () => console.log(`Completed: ${message}`)
    );
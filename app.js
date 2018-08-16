const Rx = require('rxjs');
const {map, concatAll} = require('rxjs/operators');

const EventEmitter = require('events');

// console.log(Object.keys(Rx));

// function sum(a, b) {
//     return Rx.Observable.create(subscriber => {
//         console.log('Started');
//         setTimeout(() => {
//             subscriber.next(a+b);
//             subscriber.complete();
//         }, 4000);
//     });
// }

// const o1 = Rx.from([1,2,3,4,10])

// o1.pipe(
//     map(a => [a, Math.floor(Math.random()*100) ]),
//     map(i => sum(i[0], i[1])),
//     concatAll()
// ).subscribe(console.log, console.log);

function getValues() {
    const eventEmitter = new EventEmitter();

    setTimeout(() => {
        eventEmitter.emit('val', Math.floor(Math.random()*10));
        eventEmitter.emit('val', Math.floor(Math.random()*10));
        eventEmitter.emit('val', Math.floor(Math.random()*10));
        eventEmitter.emit('val', Math.floor(Math.random()*10));
        eventEmitter.emit('val', Math.floor(Math.random()*10));
        eventEmitter.emit('complete', null);
    });

    return eventEmitter;
}

const f = (val, cb) => {
    console.log('evaluating', val);
    setTimeout(() => {
        console.log('completed', val);
        cb(null);
    }, 4000);
};

const F = val => {
    return Rx.Observable.create(subscriber => {
        f(val, (err, v) => {
            if(err) { subscriber.error(err); return; }

            subscriber.next(v);
            subscriber.complete();
        });
    });
}

const i = Rx.fromEvent(getValues(), 'val');
i.pipe(
    map(v => F(v)),
    concatAll()
).subscribe(console.log, console.error, console.log);


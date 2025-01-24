import EventEmitter from "events";
enum EOrder {
    PACKING = 'PACKING',
    DISPATCHING = 'DISPATCHING',
    DELIVERED = 'DELIVERED'
}
// const eventEmitter = new EventEmitter()

// eventEmitter.on(EOrder.PACKING, (...data) => {
//     console.log({ data })
// })

// eventEmitter.emit(EOrder.PACKING, 'hey your order is being packed !!', 'svsdds')

class Cart extends EventEmitter {
    constructor() {
        super();
    }

    packOrder(data: string) {
        this.emit(EOrder.PACKING, data)
    }
}

const obj = new Cart();
obj.on(EOrder.PACKING, (...data) => {
    console.log({ data })
})

obj.packOrder('hey');


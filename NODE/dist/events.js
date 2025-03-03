import EventEmitter from "events";
var EOrder;
(function (EOrder) {
    EOrder["PACKING"] = "PACKING";
    EOrder["DISPATCHING"] = "DISPATCHING";
    EOrder["DELIVERED"] = "DELIVERED";
})(EOrder || (EOrder = {}));
// const eventEmitter = new EventEmitter()
// eventEmitter.on(EOrder.PACKING, (...data) => {
//     console.log({ data })
// })
// eventEmitter.emit(EOrder.PACKING, 'hey your order is being packed !!', 'svsdds')
class Cart extends EventEmitter {
    constructor() {
        super();
    }
    packOrder(data) {
        this.emit(EOrder.PACKING, data);
    }
}
const obj = new Cart();
obj.on(EOrder.PACKING, (...data) => {
    console.log({ data });
});
obj.packOrder('hey');
//# sourceMappingURL=events.js.map
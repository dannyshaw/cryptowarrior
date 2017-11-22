"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LivePrice_1 = require("../../types/LivePrice");
const Logger_1 = require("../../Logger");
const GTT = require("gdax-trading-toolkit");
const logger = Logger_1.Log.getLogger("GdaxLivePriceSource");
// TODO: put into container
class TempLogger {
    log(level, message, meta) {
        logger.trace(message);
    }
    error(err) {
        logger.error(err.stack);
    }
}
class GdaxLivePriceSource {
    constructor(productIds) {
        this.productIds = productIds;
        this.subscriptionIdSeed = 0;
        this.subscriptions = {};
    }
    async subscribe(opts, callback) {
        if (!this.feed) {
            await this.init();
        }
        const id = this.subscriptionIdSeed++;
        this.subscriptions[id] = callback;
        return id;
    }
    unsubscribe(subscriptionId) {
        this.subscriptions[subscriptionId] = null;
        delete this.subscriptions[subscriptionId];
    }
    async init() {
        const tempLogger = new TempLogger();
        try {
            this.feed = await GTT.Factories.GDAX.FeedFactory(tempLogger, this.productIds);
            this.feed.on("data", this.onMessage.bind(this));
        }
        catch (e) {
            logger.error(e);
        }
    }
    onMessage(msg) {
        const priceMsg = msg;
        if (priceMsg.type === "trade") {
            const livePrice = new LivePrice_1.LivePrice(msg.productId, priceMsg.price);
            for (let key in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(key)) {
                    this.subscriptions[key](livePrice);
                }
            }
        }
        else {
            // logger.trace(`Ignoring message type: ${msg.type}`);
        }
    }
}
exports.GdaxLivePriceSource = GdaxLivePriceSource;
//# sourceMappingURL=GdaxLivePriceSource.js.map
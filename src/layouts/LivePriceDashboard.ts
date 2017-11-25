import { LivePriceComponent } from "../components/LivePriceComponent";
import { LoggerComponent } from "../components/LoggerComponent";
import {Element, LayoutBase, LayoutDetails, Location, Size} from "./LayoutBase";
import Container from "../Container";
import {KeyBinding} from "./KeyBinding";
import {ListComponent} from "../components/ListComponent";

/**
 * Displays multiple live prices
 */
export class LivePriceDashboard extends LayoutBase {
    public log: LoggerComponent;
    private screenList: ListComponent<LayoutDetails>;
    private livePriceComponent1: LivePriceComponent;
    private livePriceComponent2: LivePriceComponent;
    private livePriceComponent3: LivePriceComponent;
    private source: string;

    constructor(eventHub: PubSubJS.Base, container: Container) {
        super(12, 12, eventHub, container);
        this.source = container.source;

        this.log = new LoggerComponent(this.eventHub);
        this.livePriceComponent1 = new LivePriceComponent(this.eventHub, "BTC-USD", this.container.livePriceSource, true);
        this.livePriceComponent2 = new LivePriceComponent(this.eventHub, "ETH-USD", this.container.livePriceSource, true);
        this.livePriceComponent3 = new LivePriceComponent(this.eventHub, "LTC-USD", this.container.livePriceSource, true);
        this.screenList = container.componentFactory.createList("screen", container);
    }

    public getElements(): Element[] {
        return [
            // TODO: have component offer a preferred, overridable size and location
            new Element(this.screenList, new Location(0, 0), new Size(12, 6)),
            new Element(this.log, new Location(9, 0), new Size(3, 12)),
            new Element(this.livePriceComponent1, new Location(0, 0), new Size(2, 4)),
            new Element(this.livePriceComponent2, new Location(0, 4), new Size(2, 4)),
            new Element(this.livePriceComponent3, new Location(0, 8), new Size(2, 4)),
        ];
    }

    public bindKeys() {
        super.bindKeys();
        this.attachKeyHandler(new KeyBinding(["l"], "Show/hide Log panel"),
            (ch, key) => this.log.toggleVisibility());
        this.attachKeyHandler(new KeyBinding(["s"], "Show/hide Screen list"),
            (ch, key) => this.screenList.toggleVisibility());
    }

    protected postLoad() {
    }
}

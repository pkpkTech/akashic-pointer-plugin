export interface PointerPluginLike extends g.OperationPlugin {
	game: g.Game;
	view: HTMLElement;
	latestPointerPoint: Readonly<g.CommonOffset> | undefined;
	/** ポインタータイプが変わったときに発火 */
	onPointerTypeChanged: g.Trigger<string>;
	/** 最後のポインタータイプ */
	pointerType: string;
}

export interface PointerPluginStatic extends g.OperationPluginStatic {
	new(game: any, viewInfo: g.OperationPluginViewInfo | null, option?: any): PointerPluginLike;
}

export const PointerPlugin: PointerPluginStatic = class implements PointerPluginLike {
	game: g.Game;
	view: HTMLElement;
	operationTrigger: g.Trigger<g.OperationPluginOperation | (number | string)[]>;
	latestPointerPoint: Readonly<g.CommonOffset> | undefined;

	_onMouseMove_bound: (e: MouseEvent) => void;
	_onPointerMove_bound: (e: PointerEvent) => void;
	_getScale: () => { x: number; y: number };

	/** ポインタータイプが変わったときに発火 */
	onPointerTypeChanged: g.Trigger<string>;
	/** 最後のポインタータイプ */
	pointerType: string = "touch";

	static isSupported(): boolean {
		return (typeof document !== "undefined") && (typeof document.addEventListener === "function");
	}

	constructor(game: g.Game, viewInfo: g.OperationPluginViewInfo | null) {
		this.game = game;
		this.view = viewInfo!.view as HTMLElement; // viewInfo が必ず渡ってくるため null にはならない
		this.operationTrigger = new g.Trigger();
		this.latestPointerPoint = undefined;
		this._getScale = (viewInfo as any).getScale ? () => (viewInfo as any).getScale() : () => { return { x: 1, y: 1 } };

		this._onMouseMove_bound = this._onMouseMove.bind(this);
		this._onPointerMove_bound = this._onPointerMove.bind(this);

		this.onPointerTypeChanged = new g.Trigger();
	}

	start(): boolean {
		if ("onpointermove" in (this.view as any)) {
			this.view.addEventListener("pointermove", this._onPointerMove_bound, false);
		} else {
			this.view.addEventListener("mousemove", this._onMouseMove_bound, false);
		}
		return true;
	}

	stop(): void {
		this.view.removeEventListener("pointermove", this._onPointerMove_bound, false);
		this.view.removeEventListener("mousemove", this._onMouseMove_bound, false);
	}

	_onMouseMove(e: MouseEvent): void {
		const rect = this.view.getBoundingClientRect();
		const positionX = rect.left + window.pageXOffset;
		const positionY = rect.top + window.pageYOffset;
		const offsetX = e.pageX - positionX;
		const offsetY = e.pageY - positionY;
		const scale = this._getScale();

		const point = { x: offsetX / scale.x, y: offsetY / scale.y };
		this.latestPointerPoint = point;
	}

	_onPointerMove(e: PointerEvent): void {
		if (this.pointerType !== e.pointerType) {
			this.pointerType = e.pointerType;
			this.onPointerTypeChanged.fire(this.pointerType);
		}

		const rect = this.view.getBoundingClientRect();
		const positionX = rect.left + window.pageXOffset;
		const positionY = rect.top + window.pageYOffset;
		const offsetX = e.pageX - positionX;
		const offsetY = e.pageY - positionY;
		const scale = this._getScale();

		const point = { x: offsetX / scale.x, y: offsetY / scale.y };
		this.latestPointerPoint = point;
	}
}

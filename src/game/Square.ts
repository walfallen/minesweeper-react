import { EventEmitter } from 'events';

export enum Status {
	None,
	Flag,
	Bomb,
}

export default class Square extends EventEmitter {
	private status: Status;

	private indicator: number | undefined;

	constructor() {
		super();

		this.status = Status.None;
		this.indicator = 0;
	}

	isUncovered(): boolean {
		return this.indicator !== undefined;
	}

	setIndicator(indicator: number): void {
		this.indicator = indicator;
		this.emit('indicatorChanged', indicator);
	}

	getIndicator(): number | undefined {
		return this.indicator;
	}

	setStatus(status: Status): void {
		this.status = status;
		this.emit('statusChanged', status);
	}

	getStatus(): Status {
		return this.status;
	}
}

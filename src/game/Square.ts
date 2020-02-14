import { EventEmitter } from 'events';

export enum Status {
	Covered,
	Uncovered,
	Flagged,
}

export default class Square extends EventEmitter {
	private status: Status;

	private indicator: number;

	private text: string;

	constructor() {
		super();

		this.status = Status.Covered;
		this.indicator = 0;
		this.text = '';
	}

	isUncovered(): boolean {
		return this.status === Status.Uncovered;
	}

	isFlagged(): boolean {
		return this.status === Status.Flagged;
	}

	isBomb(): boolean {
		return this.indicator < 0;
	}

	setIndicator(indicator: number): void {
		this.indicator = indicator;
		this.emit('indicatorChanged', indicator);
	}

	getIndicator(): number {
		return this.indicator;
	}

	setStatus(status: Status): void {
		this.status = status;
		this.emit('statusChanged', status);
	}

	getStatus(): Status {
		return this.status;
	}

	setText(text: string): void {
		this.text = text;
		this.emit('textChanged', text);
	}

	getText(): string {
		return this.text;
	}
}

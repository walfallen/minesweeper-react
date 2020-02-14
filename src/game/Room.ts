import Square, { Status } from './Square';

class Room {
	private id: string;

	private key: string;

	private width: number;

	private height: number;

	private squares: Square[];

	private mineNum: number;

	constructor(width: number, height: number) {
		this.id = '';
		this.key = '';
		this.width = width;
		this.height = height;
		this.mineNum = 0;

		this.squares = new Array<Square>(width * height);
		let h = 0;
		for (let j = 0; j < height; j++) {
			for (let i = 0; i < width; i++) {
				this.squares[h++] = new Square();
			}
		}
	}

	getWidth(): number {
		return this.width;
	}

	getHeight(): number {
		return this.height;
	}

	getMineNum(): number {
		return this.mineNum;
	}

	async create(): Promise<void> {
		const res = await window.fetch(`./api/room?width=${this.width}&height=${this.height}`, { method: 'POST' });
		const room = await res.json();
		this.id = room.id;
		this.key = room.key;
		this.mineNum = room.mineNum;
	}

	getSquare(x: number, y: number): Square {
		const i = y * this.width + x;
		return this.squares[i];
	}

	async uncover(x: number, y: number): Promise<void> {
		const cur = this.getSquare(x, y);
		if (!cur || cur.isFlagged()) {
			return;
		}

		const res = await window.fetch(`./api/room/${this.id}/square/${x}/${y}?key=${this.key}`, { method: 'POST' });
		const squares = await res.json();
		for (const sq of squares) {
			const square = this.getSquare(sq.x, sq.y);
			if (!square) {
				continue;
			}
			square.setIndicator(sq.num);
			square.setStatus(Status.Uncovered);
		}
	}

	async flag(x: number, y: number): Promise<void> {
		const square = this.getSquare(x, y);
		if (!square || square.isUncovered()) {
			return;
		}

		const res = await window.fetch(`./api/room/${this.id}/square/${x}/${y}?key=${this.key}`, { method: 'PATCH' });
		if (res.status !== 200) {
			return;
		}

		square.setStatus(Status.Flagged);
	}
}

export default Room;

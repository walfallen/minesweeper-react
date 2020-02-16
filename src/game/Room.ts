import { EventEmitter } from 'events';

import Square, { Status } from './Square';
import idle from '../util/idle';

interface SquareData {
	x: number;
	y: number;
	num: number;
}

function sortSquaresAt(x: number, y: number, squares: SquareData[]): void {
	squares.sort((a: SquareData, b: SquareData) => {
		const ax = a.x - x;
		const ay = a.y - y;
		const da = ax * ax + ay * ay;
		const bx = b.x - x;
		const by = b.y - y;
		const db = bx * bx + by * by;
		return da - db;
	});
}

class Room extends EventEmitter {
	private id: string;

	private key: string;

	private width: number;

	private height: number;

	private squares: Square[];

	private uncoveredNum: number;

	private flagNum: number;

	private mineNum: number;

	constructor(width: number, height: number) {
		super();

		this.id = '';
		this.key = '';
		this.width = width;
		this.height = height;
		this.uncoveredNum = 0;
		this.flagNum = 0;
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

	async exit(): Promise<void> {
		this.squares = [];
		this.mineNum = 0;
		await window.fetch(`./api/room/${this.id}?key=${this.key}`, { method: 'DELETE' });
	}

	getSquare(x: number, y: number): Square | null {
		if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
			return null;
		}

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
		sortSquaresAt(x, y, squares);
		await this.updateSquares(squares);
		if (cur.getStatus() === Status.Covered) {
			cur.setStatus(Status.Uncovered);
		}

		this.checkGameOver();
	}

	async outspread(x: number, y: number): Promise<void> {
		const cur = this.getSquare(x, y);
		if (!cur || !cur.isUncovered() || cur.getIndicator() <= 0) {
			return;
		}

		const res = await window.fetch(`./api/room/${this.id}/outspread?key=${this.key}&x=${x}&y=${y}`, { method: 'POST' });
		const squares = await res.json();
		sortSquaresAt(x, y, squares);
		await this.updateSquares(squares);

		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) {
					continue;
				}

				const sqr = this.getSquare(x + dx, y + dy);
				if (sqr && sqr.getStatus() === Status.Covered && sqr.isBomb()) {
					sqr.setStatus(Status.Uncovered);
				}
			}
		}

		this.checkGameOver();
	}

	async updateSquares(squares: SquareData[]): Promise<void> {
		await Promise.all(squares.map(async (sq) => {
			await idle(0);
			const square = this.getSquare(sq.x, sq.y);
			if (!square || square.isUncovered()) {
				return;
			}
			square.setIndicator(sq.num);
			if (sq.num >= 0) {
				square.setStatus(Status.Uncovered);
			}
			this.uncoveredNum++;
		}));
	}

	checkGameOver(): void {
		if (this.uncoveredNum + this.flagNum < this.squares.length) {
			return;
		}

		const now = new Date();
		if (now.getDate() === 14 && now.getMonth() === 1) {
			this.showText('これからもたくさんの思い出を作ろう！カズ＆ユウ');
		}
	}

	showText(text: string): void {
		const squares = this.squares.filter((square) => square.isFlagged());
		if (squares.length < text.length) {
			return;
		}

		for (let i = 0; i < text.length; i++) {
			squares[i].setText(text.charAt(i));
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

		const status = Number.parseInt(await res.text(), 10);
		if (Number.isNaN(status)) {
			return;
		}

		square.setStatus(status);
		if (status === Status.Flagged) {
			this.emit('flagged', true);
			this.flagNum++;
			this.checkGameOver();
		} else {
			this.emit('flagged', false);
			this.flagNum--;
		}
	}
}

export default Room;

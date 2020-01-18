import * as React from 'react';

import './Square.scss';

interface SquareProps {
	x: number;
	y: number;
}

enum Status {
	Covered,
	Uncovered,
	Flagged,
	Exploded,
}

interface SquareState {
	status: Status;
	indicator: number;
}

export default class Square extends React.Component<SquareProps, SquareState> {
	constructor(props: SquareProps) {
		super(props);

		this.state = {
			status: Status.Covered,
			indicator: 0,
		};
	}

	render(): JSX.Element {
		const {
			status,
			indicator,
		} = this.state;

		const classNames = ['square'];
		switch (status) {
		case Status.Uncovered:
			classNames.push('uncovered');
			if (indicator > 0) {
				classNames.push(`indicator-${indicator}`);
			}
			break;
		case Status.Flagged:
			classNames.push('flagged');
			break;
		case Status.Exploded:
			classNames.push('exploded');
			break;
		default:
			classNames.push('covered');
		}

		return (
			<div className={classNames.join(' ')}>
				{indicator > 0 ? indicator : null}
			</div>
		);
	}
}

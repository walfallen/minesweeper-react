import * as React from 'react';

import Room from '../../game/Room';

import './InfoPanel.scss';

interface InfoPanelProps {
	room: Room;
}

interface InfoPanelState {
	flagNum: number;
}

export default class InfoPanel extends React.Component<InfoPanelProps, InfoPanelState> {
	constructor(props: InfoPanelProps) {
		super(props);

		this.state = {
			flagNum: 0,
		};
	}

	componentDidMount(): void {
		const { room } = this.props;
		room.on('flagged', this.handleFlag);
	}

	componentWillUnmount(): void {
		const { room } = this.props;
		room.off('flagged', this.handleFlag);
	}

	handleFlag = (flagged: boolean): void => {
		this.setState((prev) => ({
			flagNum: prev.flagNum + (flagged ? 1 : -1),
		}));
	}

	render(): JSX.Element {
		const {
			flagNum,
		} = this.state;

		const { room } = this.props;

		return (
			<div className="info-panel">
				<span className="flag">{flagNum}</span>
				<span className="mine">{room.getMineNum()}</span>
			</div>
		);
	}
}

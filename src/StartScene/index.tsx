import * as React from 'react';

import './index.scss';

interface StartSceneProps {
	onModeChanged: (mode: string) => void;
}

interface StartSceneState {
}

export default class StartScene extends React.Component<StartSceneProps, StartSceneState> {
	constructor(props: StartSceneProps) {
		super(props);
	}

	enterExpertMode = () => {
		const { onModeChanged } = this.props;
		setTimeout(onModeChanged, 0, 'expert');
	}

	enterMediumMode = () => {
		const { onModeChanged } = this.props;
		setTimeout(onModeChanged, 0, 'medium');
	}

	enterEasyMode = () => {
		const { onModeChanged } = this.props;
		setTimeout(onModeChanged, 0, 'easy');
	}

	render() {
		return (
			<div className="main">
				<div className="button-area">
					<button type="button" className="expert" onClick={this.enterExpertMode}>Expert</button>
					<button type="button" className="medium" onClick={this.enterMediumMode}>Medium</button>
					<button type="button" className="easy" onClick={this.enterEasyMode}>Easy</button>
				</div>
			</div>
		);
	}
}

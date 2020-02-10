import * as React from 'react';

import './index.scss';

interface StartSceneProps {
	onModeChanged: (mode: string) => void;
}

export default class StartScene extends React.Component<StartSceneProps, {}> {
	enterExpertMode = (): void => {
		const { onModeChanged } = this.props;
		setTimeout(onModeChanged, 0, 'expert');
	}

	enterMediumMode = (): void => {
		const { onModeChanged } = this.props;
		setTimeout(onModeChanged, 0, 'medium');
	}

	enterEasyMode = (): void => {
		const { onModeChanged } = this.props;
		setTimeout(onModeChanged, 0, 'easy');
	}

	render(): JSX.Element {
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

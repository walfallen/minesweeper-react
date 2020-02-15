import * as React from 'react';

import './ControlPanel.scss';

interface ControlPanelProps {
	onExit: () => void;
}

export default function ControlPanel(props: ControlPanelProps): JSX.Element {
	const { onExit } = props;

	return (
		<div className="control-panel">
			<button type="button" className="exit" onClick={onExit}>Exit</button>
		</div>
	);
}

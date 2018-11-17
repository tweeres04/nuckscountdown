import React from 'react';
import ReactDOM from 'react-dom';
import NucksCountdown from './NucksCountdown';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<NucksCountdown />, document.getElementById('root'));
registerServiceWorker();

import SnowflakeApp from '../components/SnowflakeApp'
import DeprecationNotice from '../components/DeprecationNotice'

import initFirebase from '../services/firebase'

initFirebase()

export default () => (
	<div>
		<SnowflakeApp />
	</div>
)

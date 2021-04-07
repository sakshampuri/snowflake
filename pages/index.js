import SnowflakeApp from '../components/SnowflakeApp'
import DeprecationNotice from '../components/DeprecationNotice'

import initFirebase from '../services/firebase'

initFirebase()

const Snowflake = ({}) => (
		<h1>Please use your account through Nudge to access Snowflake</h1>
)

export default Snowflake;
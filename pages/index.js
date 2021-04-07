import SnowflakeApp from '../components/SnowflakeApp'
import DeprecationNotice from '../components/DeprecationNotice'

import initFirebase from '../services/firebase'

initFirebase()

const Snowflake = ({}) => (
		<SnowflakeApp />
)

export default Snowflake;
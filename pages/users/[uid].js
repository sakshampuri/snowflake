import { useRouter } from 'next/router'
import SnowflakeApp from '../../components/SnowflakeApp'
import firebase from 'firebase'
import initFirebase from '../../services/firebase'

const UserSnowflake = ({ error, tracks, user }) => {
	const { uid } = useRouter().query

	if (error) return <h1>{error}</h1>

	if (!user) {
		return <h1>Your user does not exist in the Nudge project</h1>
	}else if(!user.milestone){
        return <h1>Your user does not have any snowflake data. Please ask admin to add.</h1>
    }

	return (
			<SnowflakeApp userID={uid} {...{ tracks, user }} />
	)
}

UserSnowflake.getInitialProps = async ({ query }) => {
    if(!firebase.apps.length) initFirebase();
	const { uid } = query

	if (!uid) return { error: 'Invalid user' }

	const db = firebase.firestore()

	const docRef = db.collection('admin').doc('snowflake_tracks')
	const userRef = db.collection('users').doc(uid)

	return docRef
		.get()
		.then((doc) => {
			if (doc.exists) {
				console.log('Document data:', doc.data())
				return { tracks: doc.data() }
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!')
				return { error: 'not found' }
			}
		})
		.then(({ tracks }) => {
			return userRef.get().then((userDoc) => {
				if (userDoc.exists) {
					return {
						tracks,
						user: userDoc.data(),
					}
				} else
					return {
						tracks,
						user: null,
					}
			})
		})
		.catch((error) => {
			console.log('Error getting document:', error)
			return { error }
		})
}

export default UserSnowflake

// @flow

import TrackSelector from '../components/TrackSelector'
import NightingaleChart from '../components/NightingaleChart'
import KeyboardListener from '../components/KeyboardListener'
import Track from '../components/Track'
import Wordmark from '../components/Wordmark'
import LevelThermometer from '../components/LevelThermometer'
import { eligibleTitles, trackIds, milestones, milestoneToPoints } from '../constants'
import PointSummaries from '../components/PointSummaries'
import type { Milestone, MilestoneMap, TrackId } from '../constants'
import React from 'react'
import TitleSelector from '../components/TitleSelector'

type SnowflakeAppState = {
	milestoneByTrack: MilestoneMap,
	name: string,
	title: string,
	focusedTrackId: TrackId,
}

const hashToState = (hash: String): ?SnowflakeAppState => {
	if (!hash) return null
	const result = defaultState()
	const hashValues = hash.split('#')[1].split(',')
	if (!hashValues) return null
	trackIds.forEach((trackId, i) => {
		result.milestoneByTrack[trackId] = coerceMilestone(Number(hashValues[i]))
	})
	if (hashValues[16]) result.name = decodeURI(hashValues[16])
	if (hashValues[17]) result.title = decodeURI(hashValues[17])
	return result
}

const coerceMilestone = (value: number): Milestone => {
	// HACK I know this is goofy but i'm dealing with flow typing
	switch (value) {
		case 0:
			return 0
		case 1:
			return 1
		case 2:
			return 2
		case 3:
			return 3
		case 4:
			return 4
		case 5:
			return 5
		default:
			return 0
	}
}

const emptyState = (): SnowflakeAppState => {
	return {
		name: '',
		title: '',
		milestoneByTrack: {
			MOBILE: 0,
			WEB_CLIENT: 0,
			FOUNDATIONS: 0,
			SERVERS: 0,
			PROJECT_MANAGEMENT: 0,
			COMMUNICATION: 0,
			CRAFT: 0,
			INITIATIVE: 0,
			CAREER_DEVELOPMENT: 0,
			ORG_DESIGN: 0,
			WELLBEING: 0,
			ACCOMPLISHMENT: 0,
			MENTORSHIP: 0,
			EVANGELISM: 0,
			RECRUITING: 0,
			COMMUNITY: 0,
		},
		focusedTrackId: 'MOBILE',
	}
}

const defaultState = (props): SnowflakeAppState => {
	return {
		name: props?.user?.name,
		title: 'Staff Engineer',
		milestoneByTrack: {
			...props?.user?.milestone,
		},
		focusedTrackId: 'MOBILE',
	}
}

const stateToHash = (state: SnowflakeAppState) => {
	if (!state || !state.milestoneByTrack) return null
	const values = trackIds.map((trackId) => state.milestoneByTrack[trackId]).concat(encodeURI(state.name), encodeURI(state.title))
	return values.join(',')
}

type Props = {}

class SnowflakeApp extends React.Component<Props, SnowflakeAppState> {
	pathURL: String
	handleRefresh

	constructor(props: Props) {
		super(props)
		this.state = emptyState()
		this.state.name = props.user.name
	}

	componentDidUpdate() {
		const hash = stateToHash(this.state)
		//if (hash) window.location.replace(`#${hash}`)
	}

	componentDidMount() {
		const state = hashToState(window.location.hash)
		const url = new URL(window.location)
		this.pathURL = url.origin + url.pathname
		this.handleRefresh = () => window.location.replace(this.pathURL)

		if (state) {
			this.setState(state)
		} else {
			this.setState(defaultState(this.props))
		}
	}

	render() {
		return (
			<main>
				<style jsx global>{`
					body {
						font-family: Helvetica;
					}
					main {
						width: 960px;
						margin: 0 auto;
					}
					.name-input {
						border: none;
						display: block;
						border-bottom: 2px solid #fff;
						font-size: 30px;
						line-height: 40px;
						font-weight: bold;
						width: 380px;
						margin-bottom: 10px;
					}
					.name-input:hover,
					.name-input:focus {
						border-bottom: 2px solid #ccc;
						outline: 0;
					}
					a {
						color: #888;
						text-decoration: none;
					}
				`}</style>
				<div style={{ margin: '19px auto 0', width: 142 }}>
					<a href='https://theatom.app' target='_blank'>
						<h1>Atom</h1>
					</a>
				</div>
				<div onClick={() => this.setState(defaultState(this.props))}>
					<a>Refresh</a>
				</div>
				<div style={{ display: 'flex' }}>
					<div style={{ flex: 1 }}>
						<form>
							<input
								type='text'
								className='name-input'
								value={this.state.name}
								onChange={(e) => this.setState({ name: e.target.value })}
								placeholder='Name'
							/>
							<TitleSelector
								milestoneByTrack={this.state.milestoneByTrack}
								currentTitle={this.state.title}
								setTitleFn={(title) => this.setTitle(title)}
							/>
						</form>
						<PointSummaries milestoneByTrack={this.state.milestoneByTrack} />
						<LevelThermometer milestoneByTrack={this.state.milestoneByTrack} />
					</div>
					<div style={{ flex: 0 }}>
						<NightingaleChart
							milestoneByTrack={this.state.milestoneByTrack}
							focusedTrackId={this.state.focusedTrackId}
							handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)}
						/>
					</div>
				</div>

				<TrackSelector
					milestoneByTrack={this.state.milestoneByTrack}
					focusedTrackId={this.state.focusedTrackId}
					setFocusedTrackIdFn={this.setFocusedTrackId.bind(this)}
				/>
				<KeyboardListener
					selectNextTrackFn={this.shiftFocusedTrack.bind(this, 1)}
					selectPrevTrackFn={this.shiftFocusedTrack.bind(this, -1)}
					increaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, 1)}
					decreaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, -1)}
				/>
				<Track
					tracks={this.props.tracks}
					milestoneByTrack={this.state.milestoneByTrack}
					trackId={this.state.focusedTrackId}
					handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)}
				/>
			</main>
		)
	}

	handleTrackMilestoneChange(trackId: TrackId, milestone: Milestone) {
		const milestoneByTrack = this.state.milestoneByTrack
		milestoneByTrack[trackId] = milestone

		const titles = eligibleTitles(milestoneByTrack)
		const title = titles.indexOf(this.state.title) === -1 ? titles[0] : this.state.title

		this.setState({ milestoneByTrack, focusedTrackId: trackId, title })
	}

	shiftFocusedTrack(delta: number) {
		let index = trackIds.indexOf(this.state.focusedTrackId)
		index = (index + delta + trackIds.length) % trackIds.length
		const focusedTrackId = trackIds[index]
		this.setState({ focusedTrackId })
	}

	setFocusedTrackId(trackId: TrackId) {
		let index = trackIds.indexOf(trackId)
		const focusedTrackId = trackIds[index]
		this.setState({ focusedTrackId })
	}

	shiftFocusedTrackMilestoneByDelta(delta: number) {
		let prevMilestone = this.state.milestoneByTrack[this.state.focusedTrackId]
		let milestone = prevMilestone + delta
		if (milestone < 0) milestone = 0
		if (milestone > 5) milestone = 5
		this.handleTrackMilestoneChange(this.state.focusedTrackId, ((milestone: any): Milestone))
	}

	setTitle(title: string) {
		let titles = eligibleTitles(this.state.milestoneByTrack)
		title = titles.indexOf(title) == -1 ? titles[0] : title
		this.setState({ title })
	}
}

export default SnowflakeApp

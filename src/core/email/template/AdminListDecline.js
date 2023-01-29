import React from 'react';
import PropTypes from 'prop-types';
import Layout from '../layouts/Layout';
import Header from '../modules/Header';
import Body from '../modules/Body';
import Footer from '../modules/Footer';
import EmptySpace from '../modules/EmptySpace';
import { url, sitename } from '../../../config';
import { PRIMARYCOLOR } from '../../../constants';

class AdminListDecline extends React.Component {

	static propTypes = {
		content: PropTypes.shape({
			userMail: PropTypes.string.isRequired,
		}).isRequired
	};

	render() {
		const buttonStyle = {
			margin: 0,
			fontFamily: 'Arial',
			padding: '10px 16px',
			textDecoration: 'none',
			borderRadius: '2px',
			border: '1px solid',
			textAlign: 'center',
			verticalAlign: 'middle',
			fontWeight: 'normal',
			fontSize: '18px',
			whiteSpace: 'nowrap',
			background: '#ffffff',
			borderColor: PRIMARYCOLOR,
			backgroundColor: PRIMARYCOLOR,
			color: '#ffffff',
			borderTopWidth: '1px',
		};

		const textStyle = {
			color: '#484848',
			backgroundColor: '#F7F7F7',
			fontFamily: 'Arial',
			fontSize: '16px',
			padding: '35px'
		};
		const { content: { hostName, listId, listTitle, logo, reason } } = this.props;
		let URL = url + `/become-a-host/${listId}/home`;

		return (
			<Layout>
				<Header color={PRIMARYCOLOR} backgroundColor="#F7F7F7" logo={logo} />
				<Body textStyle={textStyle}>
					<div>
						Hi {hostName},
                    </div>
					<EmptySpace height={20} />
					<div>
						Admin has declined your listing request for {listTitle} due to {reason}. Kindly update the listing information and submit for the approval.
                    </div>
					<EmptySpace height={40} />
					<div>
						<a style={buttonStyle} href={URL}>Update Now</a>
					</div>
					<EmptySpace height={40} />
					<div>
						Thanks, <br />
						The {sitename} Team
					</div>
				</Body>
				<Footer />
				<EmptySpace height={20} />
			</Layout>
		);
	}

}

export default AdminListDecline;
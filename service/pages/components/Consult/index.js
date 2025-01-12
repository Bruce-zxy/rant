import { BackTop } from 'antd';
import IconFont from '../IconFont';
import config from '../../config/config';

import './consult.scss';

export default (props) => (
	<div className="consult-container">
		<div className="item">
			<IconFont className="iconfont" type="icon-weixin1" />
			<p>微信订阅</p>
			<div className="saoma">
				<img className="about-banner" src={config.staticImgUrl + 'saoma.jpeg'} />
			</div>
		</div>
		<div className="top">
			<BackTop>
				<IconFont className="iconfont" type="icon-top" />
			</BackTop>
		</div>
	</div>
);

import { Button, Col, Form, Icon, Input, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import LoginLayout from '../../components/Layout/LoginLayout';
import { get, post } from '../../lib/fetch';
import { jump } from '../../lib/global';
import './forgot.scss';


export default Form.create()(props => {
	const [smsCountDown, setSmsCountDown] = useState(0);
	const [svgData, setSvgData] = useState(null);
	const [svgRefresh, setSvgRefresh] = useState(Date.now());

	const handleCountDown = val => {
		const index = setInterval(() => {
			if (val > 0) {
				setSmsCountDown(--val);
				localStorage.setItem('smsCountDown', val);
			} else {
				clearInterval(index);
			}
		}, 1000);
	};

	useEffect(() => {
		const coutDown = localStorage.getItem('smsCountDown');

		if (!!coutDown) {
			setSmsCountDown(parseInt(coutDown));

			if (coutDown > 0) {
				handleCountDown(coutDown);
			}
		}
	});

	useEffect(() => {
		get('/api/verification/svg').then(res => {
			setSvgData(res);
		});
	}, [svgRefresh]);

	const {
		form: { getFieldDecorator, getFieldValue, validateFields },
	} = props;

	const sendSMS = () => {
		validateFields(['phone', 'svgCode', 'password', 'confirmPassword'], {}, (errors, values) => {
			if (errors) {
				return false;
			}

			post('/api/verification/sms', { svgKey: svgData.key, smsType: 'password', ...values }).then(
				res => {
					if (!!res) {
						message.success('短信验证码已发送');
						handleCountDown(60);
					}

					setSvgRefresh(Date.now());
				},
			);
		});
	};

	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields((err, values) => {
			if (!err) {
				post('/api/user/reset-password', values).then(res => {
					if (!!res) {
						message.success('重置成功，2秒后自动登录');
						jump('/login', 2000);
					}
				});
			}
		});
	};

	return (
		<LoginLayout>
			<div className="login-main">
				<div className="login-box">
					<div className="right">
						<div className="login-mod">
							<div className="login-mod-box">
								<Form className="login-form" onSubmit={handleSubmit}>
									<Form.Item>
										{getFieldDecorator('phone', {
											rules: [
												{ required: true, message: '请输入手机号码' },
												{
													validator: (rule, value, callback) => {
														if (
															value &&
															!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
																value,
															)
														) {
															callback('手机号码格式不正确');
														}
														callback();
													},
												},
											],
										})(
											<Input
												size="large"
												allowClear
												prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
												placeholder="请输入手机号码"
											/>,
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('password', {
											rules: [
												{ required: true, message: '请输入密码' },
												{ min: 6, message: '密码长度不少于6位' },
												{ max: 12, message: '密码长度不多于12位' },
											],
										})(
											<Input
												size="large"
												allowClear
												prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请输入密码"
											/>,
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('confirmPassword', {
											rules: [
												{ required: true, message: '请确认密码' },
												{ min: 6, message: '密码长度不少于6位' },
												{ max: 12, message: '密码长度不多于12位' },
												{
													validator: (rule, value, callback) => {
														if (value && value !== getFieldValue('password')) {
															callback('两次输入不一致');
														}
														callback();
													},
												},
											],
										})(
											<Input
												size="large"
												allowClear
												prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
												type="password"
												placeholder="请确认密码"
											/>,
										)}
									</Form.Item>
									<Form.Item>
										<Row gutter={8}>
											<Col span={18}>
												{getFieldDecorator('svgCode', {
													rules: [
														{ required: true, message: '请输入图形验证码' },
														{ len: 4, message: '验证码长度为4位' },
													],
												})(
													<Input
														size="large"
														allowClear
														prefix={<Icon type="qrcode" style={{ color: 'rgba(0,0,0,.25)' }} />}
														placeholder="请输入图形验证码"
													/>,
												)}
											</Col>
											<Col span={6}>
												<span
													style={{ display: 'flex' }}
													onClick={() => setSvgRefresh(Date.now())}
													dangerouslySetInnerHTML={{ __html: svgData ? svgData.data : '' }}
												></span>
											</Col>
										</Row>
									</Form.Item>
									<Form.Item>
										<Row gutter={8}>
											<Col span={18}>
												{getFieldDecorator('smsCode', {
													rules: [
														{ required: true, message: '请输入您收到的短信验证码' },
														{ len: 4, message: '验证码长度为4位' },
													],
												})(
													<Input
														size="large"
														allowClear
														prefix={<Icon type="qrcode" style={{ color: 'rgba(0,0,0,.25)' }} />}
														placeholder="请输入您收到的短信验证码"
													/>,
												)}
											</Col>
											<Col span={6}>
												<Button disabled={smsCountDown > 0} onClick={() => sendSMS()}>
													{smsCountDown <= 0 ? '获取验证码' : `${smsCountDown}秒后可重发`}
												</Button>
											</Col>
										</Row>
									</Form.Item>
									<Form.Item>
										<Button type="primary" size="large" block htmlType="submit" className="login-form-button">
											重置密码
          								</Button>
										<Button
											type="dashed"
											style={{ marginTop: 10 }}
											size="large"
											block
											onClick={() => window.history.back()}
										>
											返回
          								</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</LoginLayout>
	);
});
import React, { Fragment } from 'react';
import { Row, Col, Form, Select, Input, Button, Upload, Icon, message } from 'antd';
import LoginContext from '../../../components/context/LoginContext';
import { apiUpdateUserInfo, uploadFile } from '../../../services/common';

import './index.scss';

const Option = Select.Option;

@Form.create()
export default class extends React.Component {
	state = {
		idcard_a: null,
		idcard_b: null
	};

	constructor(props) {
		super(props);
	}

	normFile = (e) => {
		console.log('Upload event:', e);
		if (Array.isArray(e)) {
			return e;
		}
		return e && e.fileList;
	};

	handleSubmit = (e, user) => {
		e.preventDefault();

		const { idName } = this.props;
		const idcard_a = this.state.idcard_a || user.idcard_a;
		const idcard_b = this.state.idcard_b || user.idcard_b;

		if (user.id_name === '游客') {
			if (idName !== '项目方' && idName !== '资金方' && idName !== '服务商') {
				message.error('请选择会员身份');
				return false;
			}
		}

		if (!idcard_a) {
			message.error('请上传身份证电子版头像面');
			return false;
		}

		if (!idcard_b) {
			message.error('请上传身份证电子版国徽面');
			return false;
		}

		this.props.form.validateFields((err, values) => {
			if (!!err) {
				return false;
			}

			const payload = {
				id_type: '个人',
				id_name: user.id_name === '游客' ? idName : user.id_name,
				status: 'PENDING',
				idcard_a,
				idcard_b,
				...values
			};

			apiUpdateUserInfo(payload).then(() => {
				window.location.reload();
			});
		});
	};

	render() {
		const { area } = this.props;
		const { getFieldDecorator } = this.props.form;

		return (
			<LoginContext.Consumer>
				{(context) => {
					const user = context.user;

					if (!user) return '';

					const idcard_a = this.state.idcard_a || user.idcard_a;
					const idcard_b = this.state.idcard_b || user.idcard_b;

					return (
						<Row>
							<Col span={16}>
								<Form onSubmit={(e) => this.handleSubmit(e, user)}>
									<Form.Item label={'姓名：'}>
										{getFieldDecorator('real_name', {
											initialValue: user.real_name,
											rules: [ { required: true, message: '姓名' } ]
										})(<Input disabled={!!user.vip} />)}
									</Form.Item>
									<Form.Item label={'联系电话'}>
										{getFieldDecorator('phonenumber', {
											initialValue: user.phonenumber,
											rules: [ { required: true, message: '联系电话', whitespace: true } ]
										})(<Input disabled={true} />)}
									</Form.Item>
									<Form.Item label={'身份证号码：'}>
										{getFieldDecorator('org_name', {
											initialValue: user.org_name,
											rules: [
												{ required: true, message: '身份证号码', whitespace: true },
												{
													pattern: /^[1-9][0-7]\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/,
													message: '格式不正确'
												}
											]
										})(<Input disabled={!!user.vip} />)}
									</Form.Item>
									{/* <Form.Item label="身份证正面照片">
								<Upload
									action={null}
									showUploadList={false}
									beforeUpload={(file) =>
										uploadFile(file).then((res) => {
											this.setState((state) => ({
												...state,
												idcard_a: res
											}));
										})}
								>
									{!!idcard_a && !!idcard_a.url ? (
										<img style={{ maxWidth: 400 }} src={idcard_a.url} />
									) : (
										<Button>
											<Icon type="upload" /> 请上传图片
										</Button>
									)}
								</Upload>
							</Form.Item>
							<Form.Item label="身份证反面照片">
								<Upload
									action={null}
									showUploadList={false}
									beforeUpload={(file) =>
										uploadFile(file).then((res) => {
											this.setState((state) => ({
												...state,
												idcard_b: res
											}));
										})}
								>
									{!!idcard_b && !!idcard_b.url ? (
										<img style={{ maxWidth: 400 }} src={idcard_b.url} />
									) : (
										<Button>
											<Icon type="upload" /> 请上传图片
										</Button>
									)}
								</Upload>
							</Form.Item> */}
									<Form.Item label="所在地区：" hasFeedback>
										{getFieldDecorator('area', {
											initialValue: user.area,
											rules: [ { required: true, message: '请选择所在地区' } ]
										})(
											<Select
												disabled={!!user.vip}
												placeholder="请选择所在地区"
												style={{ width: 120, marginRight: 10 }}
											>
												{!!area &&
													area.map((item, index) => (
														<Option value={item} key={index}>
															{item}
														</Option>
													))}
											</Select>
										)}
									</Form.Item>

									<Form.Item>
										{user.status === 'FOLLOW' ? (
											<Button type="primary" htmlType="submit">
												保存资料
											</Button>
										) : (
											''
										)}
										{user.status === 'REJECT' ? (
											<Button type="primary" htmlType="submit">
												重新提交
											</Button>
										) : (
											''
										)}
										{user.status === 'PENDING' ? (
											<Button disabled={true} type="primary" htmlType="submit">
												正在审核中
											</Button>
										) : (
											''
										)}
										{user.status === 'OVER' ? (
											<Button disabled={true} type="primary" htmlType="submit">
												审核已通过
											</Button>
										) : (
											''
										)}
									</Form.Item>
								</Form>
							</Col>
							<Col span={4}>
								<Upload
									action={null}
									showUploadList={false}
									beforeUpload={(file) => {
										if (file.size > 2 * 1024 * 1024) {
											message.error('请上传小于2M的图片');
											return false;
										}
										uploadFile(file).then((res) => {
											this.setState((state) => ({
												...state,
												idcard_a: res
											}));
										});
									}}
								>
									<div className="upload-idcard">
										{!!idcard_a && !!idcard_a.url ? (
											<Fragment>
												<img style={{ maxWidth: 300 }} src={idcard_a.url} />
												<Button className="upload-btn">
													<Icon disabled={!!user.vip} type="upload" />重新上传
												</Button>
											</Fragment>
										) : (
											<Fragment>
												<p className="ant-upload-drag-icon" style={{ width: 300 }}>
													<Icon type="upload" />
												</p>
												<p className="ant-upload-text">点击上传身份证电子版头像面</p>
												<p className="ant-upload-hint">图片大小不超过2M</p>
											</Fragment>
										)}
									</div>
								</Upload>
								<Upload
									action={null}
									showUploadList={false}
									beforeUpload={(file) => {
										if (file.size > 2 * 1024 * 1024) {
											message.error('请上传小于2M的图片');
											return false;
										}
										uploadFile(file).then((res) => {
											this.setState((state) => ({
												...state,
												idcard_b: res
											}));
										});
									}}
								>
									<div className="upload-idcard">
										{!!idcard_b && !!idcard_b.url ? (
											<Fragment>
												<img style={{ maxWidth: 300 }} src={idcard_b.url} />
												<Button className="upload-btn">
													<Icon type="upload" />重新上传
												</Button>
											</Fragment>
										) : (
											<Fragment>
												<p className="ant-upload-drag-icon" style={{ width: 300 }}>
													<Icon type="upload" />
												</p>
												<p className="ant-upload-text">点击上传身份证电子版国徽面</p>
												<p className="ant-upload-hint">图片大小不超过2M</p>
											</Fragment>
										)}
									</div>
								</Upload>
							</Col>
						</Row>
					);
				}}
			</LoginContext.Consumer>
		);
	}
}

import React, { useEffect, useState, Fragment } from 'react';
import { withRouter } from 'next/router';
import { Anchor, Form, Select, Input, Button, Cascader, Checkbox, Row, Col, message, Modal } from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import config from '../../config/config';
import { toSetWeChatShareConfig } from '../../lib/global';

import 'react-lazy-load-image-component/src/effects/blur.css';
import 'antd/dist/antd.min.css';
import './index.scss';

const { Link } = Anchor;
const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17, offset: 1 },
};
const formTailLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18, offset: 6 },
};
const centerLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 15, offset: 9 },
};

const toTransformAreaTreeProps = (data, map) => data.map(node => {
    let node_object = {
        label: node[map.key || 'key'],
        value: node[map.value || 'value']
    }
    if (node.children) {
        node_object[map.children || 'children'] = toTransformAreaTreeProps(node.children, map);
    }
    return node_object;
});

const toGetParentArrayByChildNode = (tree, target) => {
    let key = Object.keys(target).shift();
    let val = target[key];
    for (let treeNode of tree) {
        if (treeNode[key] === val) return [treeNode];
        if (treeNode.children) {
            let childNode = toGetParentArrayByChildNode(treeNode.children, target);
            if (childNode) {
                return [treeNode].concat(childNode);
            };
        }
    }
}

const DoubleInput = (props) => {

    const { onChange, extra, set } = props;
    const [state, setState] = useState([])

    const onChangeHandler = (key) => (val) => {
        state[key] = val.target.value;
        setState(state)
        if (!state[0] || !state[1]) {
            onChange('');
        } else {
            onChange(state.join(','));
        }
    }

    return (
        <div className="double-input" style={{ position: "relative" }}>
            <Input type="text" placeholder="姓名" style={{width: "65%"}} onChange={onChangeHandler(0)}/>
            <Input type="number" placeholder="手机号码" onChange={onChangeHandler(1)} pattern="[0-9]"/>
            {!extra && <img onClick={() => set(true)} style={{ width: "25px", position: "absolute", right: "-28px", top: "3px", }} src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wgARCAAvAC8DASIAAhEBAxEB/8QAGwABAAEFAQAAAAAAAAAAAAAABgABAwQFBwL/xAAYAQEBAQEBAAAAAAAAAAAAAAADBAIBBf/aAAwDAQACEAMQAAABf0ros7vbPlSobl8ko86Y3sEdN1UB6MVWZDKV4CBbplkbgi3O2PTBNfWRsv/EAB8QAAICAgIDAQAAAAAAAAAAAAIDAQQABRASERMVMf/aAAgBAQABBQLPzC2VYTAxYPO1Mgq5pjLvy9IvUWtODpVBqr4a0Urs32vlcExseuunXWSMonzG4bPfKxdLNnWg46dKLRV0xXSyohxfPq58+rkDAitK08f/xAAdEQADAAMBAAMAAAAAAAAAAAABAgMABBIRECFh/9oACAEDAQE/AZp2wXL6aonS/GvB6H1c3C4AQnKzM25OR3JzQL5ltvpg0/rL7BqfzP/EABsRAAIDAQEBAAAAAAAAAAAAAAECAAMREjEQ/9oACAECAQE/AWODYlpJw/HcL7Ks9it0Nj1Mx2JVgwxE5n//xAAjEAABAwMEAgMAAAAAAAAAAAABAAIRAxIxEBMhQSAzQlFx/9oACAEBAAY/AtLb1c0yPCG9nR7PjE+Bpu7UCoyP1ZlxydS92Ajzaz6Ca2clWBw4Cq7tTviVwm0usnSm49FOq7hTwXkWoUwZhXVKYJXpC9QVowjttic6f//EAB8QAQACAgIDAQEAAAAAAAAAAAEAESExEEEgUWHxwf/aAAgBAQABPyGKC1oJZCX2GIJG+k8LSViX5xlP+jw1u9vUuc+ySIaHNGvqA8PogaVdW4qEOO2GdgbEC5CfIobgUcHrUaVql1ufOQzcVGOzMRjq1Z+6z95hEMCgj1W+6d8f/9oADAMBAAIAAwAAABD7HzRLwlMz/8QAHREBAAICAgMAAAAAAAAAAAAAAQARMUEQcZGh0f/aAAgBAwEBPxBjdsds2Zvi/wBQbllG9BXmLNEuKszj7AsSCnGPceA9J//EABsRAAMAAgMAAAAAAAAAAAAAAAABERAhMVFh/9oACAECAQE/EK3QmznC6bUV21UgiAaaRQ2oWvp//8QAIxABAAIBAwMFAQAAAAAAAAAAAQARITFBYRBxwSBRgZHwof/aAAgBAQABPxCOTAtXaKiBpv8A2hbptdj6L+BVv4+einpBJsWDz6A4xYGq2SP7ooaV2W4YVojo8HHUUYr7vtLmypVWcsVZJa0sDVTOoasqCY0sWun0QI16KsjujlRdPPTTwiy6tdYDBswvygEnUniPc5d9uN0sUjB2Z+T8wBs/fzKZl6N40rMUF7BOXz0//9k=" alt="add" />}
        </div>
    )
}

export default Form.create()(withRouter((props) => {

    const [flag, setFlag] = useState(false);
    const [area, setArea] = useState(null);

    const { router, form } = props;
    const { getFieldDecorator, getFieldsError, validateFields } = form;
    
    useEffect(() => {
        if (document) document.title = '2019江西省第三届文化和旅游投资发展促进会开始报名了';
        toSetWeChatShareConfig('2019江西省第三届文化和旅游投资发展促进会开始报名了', '【报名啦】2019江西省第三届文化和旅游投资发展促进会火热报名中，欢迎各大优秀旅游企业共襄盛会！', window.location.origin + config.staticImgUrl + `topic/topic@small.jpg`);
        if (!sessionStorage.getItem('area')) {
            fetch('/api/metadata/tree/descendantsTree/%E5%9C%B0%E5%8C%BA').then(res => res.json()).then((res) => {
                if (res && res.length > 0) {
                    setArea(res);
                    sessionStorage.setItem('area', JSON.stringify(res));
                }
            })
        } else {
            setArea(JSON.parse(sessionStorage.getItem('area')));
        }
    }, [])

    const hasErrors = (fieldsError) => Object.keys(fieldsError).some(field => fieldsError[field]);

    const handleSubmit = e => {
        e.preventDefault();
        validateFields(async (err, values) => {
            if (!err) {
                let req_obj = {
                    ex_info: {
                        participants: []
                    }
                };
                if (values.area.find((item => item === '南昌市')) && values.board_and_lodging && values.board_and_lodging.find(item => item === 'stay5')) {
                    return Modal.info({
                        title: '注意',
                        content: '很抱歉，无法提供南昌市企业人员的住宿需求！',
                        centered: true,
                        maskClosable: true
                    });
                }
                let area_item = toGetParentArrayByChildNode(area, { title: values.area[2] })[2];
                let user_1 = values.participants_1 ? values.participants_1.split(",") : null;
                let user_2 = values.participants_2 ? values.participants_2.split(",") : null;

                if (user_1) {
                    req_obj.realname = user_1[0];
                    req_obj.phone = user_1[1];
                    if (user_1[1].length !== 11) {
                        return Modal.info({
                            title: '注意',
                            content: '请正确填写第一位参会人的手机号！',
                            centered: true,
                            maskClosable: true
                        });
                    }
                    req_obj.ex_info.participants.push({ realname: user_1[0], phone: user_1[1] });
                }
                if (user_2) {
                    if (user_2[1].length !== 11) {
                        return Modal.info({
                            title: '注意',
                            content: '请正确填写第二位参会人的手机号！',
                            centered: true,
                            maskClosable: true
                        });
                    }
                    req_obj.ex_info.participants.push({ realname: user_2[0], phone: user_2[1] });
                }
                if (!user_1 && !user_1 || !values.company) return;
                req_obj.area = area_item;
                req_obj.company = values.company;
                req_obj.org_type = values.org_type;
                if (values.board_and_lodging) {
                    req_obj.ex_info.board_and_lodging = values.board_and_lodging;
                }

                try {
                    const res = await fetch('/api/customer', {
                        method: "POST",
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(req_obj)
                    }).then(res => res.json());

                    if (res && res.id) {
                        Modal.confirm({
                            title: '提交成功！',
                            content: (
                                <Fragment>
                                    <p>您的参会申请已提交成功，我们的工作人员将在2个工作日之内通过电话联系您，请保持电话畅通。</p>
                                    <p>您如果有融资或者投资需求，欢迎访问旅游项目平台，我们提供专业的投融资指导和前沿的金融政策资讯。</p>
                                    <span className="modal-close" onClick={() => {window.location.href = ('/topic'); Modal.destroyAll()}}>
                                        <svg t="1569808793246" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="200" height="200">
                                            <path d="M155.252 943.825c-19.213 0-38.429-7.332-53.089-21.988-29.317-29.321-29.317-76.855 0-106.175l713.494-713.494c29.317-29.321 76.853-29.321 106.175 0 29.317 29.317 29.317 76.855 0 106.175l-713.494 713.494c-14.66 14.66-33.874 21.988-53.089 21.988z" fill="#999999" p-id="2480"></path>
                                            <path d="M868.749 943.824c-19.213 0-38.428-7.332-53.089-21.988l-713.494-713.493c-29.317-29.317-29.317-76.857 0-106.175 29.316-29.317 76.855-29.321 106.174 0l713.494 713.492c29.317 29.321 29.317 76.855 0 106.175-14.657 14.661-33.871 21.993-53.087 21.993z" fill="#999999" p-id="2481"></path>
                                        </svg>
                                    </span>
                                </Fragment>
                            ),
                            okText: '我要投资',
                            cancelText: '我要融资',
                            onOk: () => { window.location.href = ('/project'); Modal.destroyAll() },
                            onCancel: () => { window.location.href = ('/finance'); Modal.destroyAll() },
                            maskClosable: true,
                            centered: true,
                            zIndex: 999999
                        });
                    } else {
                        message.error('报名失败！');
                    }
                } catch (error) {
                    message.error('服务器错误，报名失败！');
                }
                
            }
        });
    };

    

    return (
        <div id="topic-page">
            <div className="topic-navi">
                <Anchor className="topic-navi-container">
                    <Link href="#meeting-background" title="会议背景" />
                    <Link href="#group-introduction" title="集团介绍" />
                    <Link href="#important-guest" title="重要嘉宾"/>
                    <Link href="#agenda" title="会议议程"/>
                    <Link href="#meeting-address" title="会议地址"/>
                    <Link href="#registration" title="报名参会"/>
                    <Link href="#sponsor" title="赞助单位"/>
                </Anchor>
            </div>
            <div className="topic-banner">
                <LazyLoadImage
                    width="100%"
                    height="100%"
                    effect="blur"
                    placeholderSrc={config.staticImgUrl + `topic/topic@small.jpg`}
                    src={config.staticImgUrl + `topic/topic@large.jpg`} // use normal <img> attributes as props
                    alt="banner"
                />
            </div>
            <div className="topic-main">
                <p className="line-1">文旅产业投资的机遇与困惑</p>
                <div className="line-divider"></div>
                <p className="line-2">指导单位：江西省文化和旅游厅</p>
                <p className="line-3">主办单位：江西省旅游集团</p>
                <p className="line-4">2019.11.8 | 江西·南昌</p>
                <p className="line-5">
                    <a className="to-register" href="#registration">立即报名</a>
                </p>
                <p id="meeting-background" className="intro-title">
                    <i></i>
                    <i></i>
                    <i></i>
                    <span>会议背景</span>
                    <i></i>
                    <i></i>
                    <i></i>
                </p>
                <div className="intro-content">
                    <p>为搭建江西省文化和旅游企业与资本对接合作平台，聚集省内外优秀文化和旅游企业及金融机构，共同交流工作、对接项目、深化合作，建立文旅产融结合长效对接机制，全力助推江西文旅产业高质量发展。现诚挚邀您出席参加2019江西省文化旅游投资发展促进会，共襄盛会！</p>
                </div>
                <p id="group-introduction" className="intro-title">
                    <i></i>
                    <i></i>
                    <i></i>
                    <span>集团介绍</span>
                    <i></i>
                    <i></i>
                    <i></i>
                </p>
                <div className="intro-content">
                    <p>江西省旅游集团是立足江西旅游资源优势和旅游产业发展优势成立的具有国资背景的综合性现代旅游集团。集团自成立来，围绕“旅游大消费共享平台”的发展定位，构建了“2+6”（两个渠道平台+六大业务板块）的业务架构体系，具体涵盖“赣游通”旅游全要素互联网渠道平台和金融服务自主运营平台两大平台，以及景区与城市微旅游目的地、酒店与民宿、旅游餐饮、旅游快消品、旅游康养与旅行社综合服务六大业务板块。</p>
                </div>
                <p id="important-guest" className="intro-title">
                    <i></i>
                    <i></i>
                    <i></i>
                    <span>重要嘉宾（排名不分先后）</span>
                    <i></i>
                    <i></i>
                    <i></i>
                </p>
                <div className="intro-guest">
                    <div>
                        <LazyLoadImage
                            width="100%"
                            height="100%"
                            effect="blur"
                            placeholderSrc={config.staticImgUrl + `topic/hxy-80.png`}
                            src={config.staticImgUrl + `topic/hxy-533.png`} // use normal <img> attributes as props
                            alt="banner"
                        />
                        <p>何新跃</p>
                        <p>江西省旅游集团股份有限公司</p>
                        <p>党委委员、副总经理</p>
                    </div>
                    <div>
                        <LazyLoadImage
                            width="100%"
                            height="100%"
                            effect="blur"
                            placeholderSrc={config.staticImgUrl + `topic/xh-80.png`}
                            src={config.staticImgUrl + `topic/xh-533.png`} // use normal <img> attributes as props
                            alt="banner"
                        />
                        <p>夏晗</p>
                        <p>景域驴妈妈集团</p>
                        <p>副总裁</p>
                    </div>
                    <div>
                        <LazyLoadImage
                            width="100%"
                            height="100%"
                            effect="blur"
                            placeholderSrc={config.staticImgUrl + `topic/guest-1@small.jpg`}
                            src={config.staticImgUrl + `topic/guest-1@large.jpg`} // use normal <img> attributes as props
                            alt="banner"
                        />
                        <p>何进</p>
                        <p>浙江黄龙体育投资管理有限公司</p>
                        <p>总经理</p>
                    </div>
                    <div>
                        <LazyLoadImage
                            width="100%"
                            height="100%"
                            effect="blur"
                            placeholderSrc={config.staticImgUrl + `topic/wrs-80.png`}
                            src={config.staticImgUrl + `topic/wrs-533.png`} // use normal <img> attributes as props
                            alt="banner"
                        />
                        <p>吴若山</p>
                        <p>人民日报社人民文旅智库</p>
                        <p>理事长兼首席研究员</p>
                    </div>
                    <div>
                        <LazyLoadImage
                            width="100%"
                            height="100%"
                            effect="blur"
                            placeholderSrc={config.staticImgUrl + `topic/ljw-80.png`}
                            src={config.staticImgUrl + `topic/ljw-533.png`} // use normal <img> attributes as props
                            alt="banner"
                        />
                        <p>刘杰武</p>
                        <p>深圳大学文化与旅游新业态发展研究中心</p>
                        <p>副研究员</p>
                    </div>
                </div>
                <div id="agenda" className="intro-meeting">
                    <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="blur"
                        placeholderSrc={config.staticImgUrl + `topic/part-1@small.jpg`}
                        src={config.staticImgUrl + `topic/part-1@large.jpg`} // use normal <img> attributes as props
                        alt="banner"
                    />
                    <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="blur"
                        placeholderSrc={config.staticImgUrl + `topic/part-2@small.jpg`}
                        src={config.staticImgUrl + `topic/part-2@large.jpg`} // use normal <img> attributes as props
                        alt="banner"
                    />
                    <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="blur"
                        placeholderSrc={config.staticImgUrl + `topic/part-3@small.jpg`}
                        src={config.staticImgUrl + `topic/part-3@large.jpg`} // use normal <img> attributes as props
                        alt="banner"
                    />
                </div>

                <p id="meeting-address" className="intro-title">
                    <i></i>
                    <i></i>
                    <i></i>
                    <span>会议地址</span>
                    <i></i>
                    <i></i>
                    <i></i>
                </p>
                <div className="intro-content">
                    <p style={{ textAlign: "center" }}>江西省·南昌市·西湖区八一大道138号赣江宾馆</p>
                    <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="blur"
                        placeholderSrc={config.staticImgUrl + `topic/座位图.png`}
                        src={config.staticImgUrl + `topic/座位图.png`} // use normal <img> attributes as props
                        alt="banner"
                    />
                </div>

                <p id="registration" className="intro-title">
                    <i></i>
                    <i></i>
                    <i></i>
                    <span>报名参会</span>
                    <i></i>
                    <i></i>
                    <i></i>
                </p>
                <div className="intro-content topic-form">
                    <Form onSubmit={handleSubmit}>
                        <Form.Item label={<p><span>企</span><span>业</span><span>类</span><span>别</span></p>} {...formItemLayout}>
                            {getFieldDecorator('org_type', {
                                rules: [{ required: true, message: '请选择企业类别' }],
                            })(
                                <Select placeholder="一 请选择企业类别 一">
                                    <Option value="旅游康养">旅游康养</Option>
                                    <Option value="景区">景区</Option>
                                    <Option value="酒店与民宿">酒店与民宿</Option>
                                    <Option value="餐饮">餐饮</Option>
                                    <Option value="旅行社">旅行社</Option>
                                    <Option value="旅游大交通">旅游大交通</Option>
                                    <Option value="小额贷款">小额贷款</Option>
                                    <Option value="典当公司">典当公司</Option>
                                    <Option value="担保公司">担保公司</Option>
                                    <Option value="金融租赁">金融租赁</Option>
                                    <Option value="商业银行">商业银行</Option>
                                    <Option value="基金公司">基金公司</Option>
                                    <Option value="证券公司">证券公司</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label={<p>企业名称</p>} {...formItemLayout}>
                            {getFieldDecorator('company')(
                                <Input placeholder="一 请填写企业全称 一" />
                            )}
                            <p style={{ color: "red", fontSize: "12px", letterSpacing: 0, margin: "5px 0 0", lineHeight: 1.2 }}>需填写单位全称</p>
                        </Form.Item>
                        <Form.Item label={<p>企业地址</p>} {...formItemLayout}>
                            {getFieldDecorator('area', {
                                rules: [
                                    { type: 'array', required: true, message: '请选择企业所在的地址' },
                                ],
                            })(<Cascader placeholder="一 请选择企业地址 一" options={area ? toTransformAreaTreeProps(area.sort((a, b) => a.title === '江西省' ? -1 : 1), { key: 'title', value: 'title' }) : []} />)}
                        </Form.Item>
                        <Form.Item label={<p>参 会 人</p>} {...formItemLayout}>
                            {getFieldDecorator('participants_1')(
                                <DoubleInput extra={flag} set={setFlag} />
                            )}
                            <p style={{ color: "red", fontSize: "12px", letterSpacing: 0, margin: "5px 0 0", lineHeight: 1.2 }}>↑ 此参会人作为会议联系人，允许最多2位参会人</p>
                        </Form.Item>
                        {flag && <Form.Item label={<p>参 会 人</p>} {...formItemLayout}>
                            {getFieldDecorator('participants_2')(
                                <DoubleInput extra={flag} set={setFlag} />
                            )}
                        </Form.Item>}
                        <Form.Item label={<p>食　　宿</p>} {...formItemLayout}>
                            {getFieldDecorator('board_and_lodging')(
                                <Checkbox.Group>
                                    <Row>
                                        <Col span={24}>
                                            <Checkbox value="dinner5">11月5日晚餐</Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="stay5">11月5日住宿(含次日早餐)</Checkbox>
                                        </Col>
                                        <Col span={24}>
                                            <Checkbox value="lunch6">11月6日午餐</Checkbox>
                                        </Col>
                                    </Row>
                                </Checkbox.Group>
                            )}
                        </Form.Item>
                        <p style={{ color: "#999", fontSize: "12px", margin: "5px 0 10px", lineHeight: 1.2 }}>注：南昌市企业参会人员不提供住宿</p>
                        <Form.Item {...centerLayout}>
                            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>提交</Button>
                        </Form.Item>
                    </Form>
                    
                </div>

                <p id="sponsor" className="intro-title">
                    <i></i>
                    <i></i>
                    <i></i>
                    <span>赞助单位</span>
                    <i></i>
                    <i></i>
                    <i></i>
                </p>
                <div className="intro-content sponsor-list">
                    <img src={config.staticImgUrl + `topic/bjyh.jpg`} alt='北京银行' />
                    <img src={config.staticImgUrl + `topic/sponsor_1.jpg`} alt='江西银行' />
                    <img src={config.staticImgUrl + `topic/msyh.jpg`} alt='民生银行' />
                    <img src={config.staticImgUrl + `topic/gdyh.jpg`} alt='广大银行' />
                </div>
                <div className="empty-divider"></div>
                <div className="empty-divider"></div>
                <div className="empty-divider"></div>
            </div>
        </div>
    )
}));
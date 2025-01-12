import ImageCropper from '@/components/ImageCropper';
import StandardTabList from '@/components/StandardTabList';
import { M_CREATE_CAPITAL, M_UPDATE_CAPITAL, Q_GET_CAPITAL } from '@/gql';
import { IFModeEnum } from '@/utils/enum';
import { uploadOne } from '@/utils/fetch';
import { getAreaList, toGetParentArrayByChildNode } from '@/utils/global';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import {
  Affix,
  Button,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { router, withRouter } from 'umi';
import { Q_GET_CAPITAL_METADATA } from '../gql';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      return (
        <Fragment>
          <Affix style={{ display: 'inline-block' }} offsetTop={80}>
            <Button style={{ borderRadius: 4 }} type="primary" onClick={() => router.goBack()}>
              返回
            </Button>
          </Affix>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);

const DetailForm = Form.create()(props => {
  const {
    data: {
      industry = [],
      type = [],
      invest_area = [],
      equity_type = [],
      stage = [],
      invest_type = [],
      ratio = [],
      risk = [],
      data = [],
    },
  } = useQuery(Q_GET_CAPITAL_METADATA, {
    notifyOnNetworkStatusChange: true,
  });

  const { form, target, mutation, area, category, areaList, setCategory } = props;
  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
      md: {
        span: 12,
      },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 7,
      },
    },
  };

  const disabled = false;

  const lengthValidator = (rule, value, callback) => {
    if (value.length > 3) {
      callback('最多选择3项');
    }
    callback();
  };

  return (
    <Form
      style={{ marginTop: 20 }}
      onSubmit={e => {
        e.preventDefault();

        form.validateFields((err, values) => {
          if (!!err) {
            message.error('请正确填写信息');
            return false;
          }

          const data = {
            title: values.title,
            contact: values.contact,
            phone: values.phone,
            company: values.company,
            publish_at: values.publish_at,
            industry: values.industry ? values.industry.map(item => ({ id: item })) : null,
            amount: values.amount,
            type: values.type ? values.type.map(item => ({ id: item })) : null,
            area: { id: values.area.pop() },
            invest_area: values.invest_area ? values.invest_area.map(item => ({ id: item })) : null,
            category,
            equity_type: { id: values.equity_type },
            stage: values.stage ? values.stage.map(item => ({ id: item })) : null,
            term: values.term,
            invest_type: values.invest_type ? values.invest_type.map(item => ({ id: item })) : null,
            ratio: { id: values.ratio },
            pre_payment: values.pre_payment,
            return: values.return,
            risk: { id: values.risk },
            pledge: values.pledge,
            discount: values.discount,
            data: values.data ? values.data.map(item => ({ id: item })) : null,
            info: values.info,
          };

          const variables = { data };

          if (target.id) {
            variables.id = target.id;
          }

          mutation({ variables });
        });
      }}
    >
      <Row>
        <Col>
          <Form.Item {...formItemLayout} label={'标题'}>
            {getFieldDecorator('title', {
              initialValue: target ? target.title : null,
              rules: [
                { required: true, message: '请填写标题', whitespace: true },
                { max: 35, message: '最多35个字符' },
                { min: 5, message: '最少5个字符' },
              ],
            })(<Input disabled={disabled} style={{ width: 500 }} placeholder="请填写标题" />)}
            <div style={{ color: 'red' }}>
              参考格式：寻+（省级）投资地区+（行业）项目+合作方式+（市级）资金所在地+资金主体+金额
            </div>
          </Form.Item>
          <FormItem {...formItemLayout} label="联系人">
            {getFieldDecorator('contact', {
              initialValue: target.contact,
              rules: [
                {
                  required: true,
                  message: '联系人不能为空',
                },
              ],
            })(<Input placeholder="请填写联系人" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="联系方式">
            {getFieldDecorator('phone', {
              initialValue: target.phone,
              rules: [
                {
                  required: true,
                  message: '联系方式不能为空',
                },
              ],
            })(<Input placeholder="请填写联系方式" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="企业名称">
            {getFieldDecorator('company', {
              initialValue: target.company,
            })(<Input placeholder="请填写企业名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="发布时间">
            {getFieldDecorator('publish_at', {
              initialValue: moment(target.publish_at),
            })(<DatePicker showTime />)}
          </FormItem>
          <Form.Item {...formItemLayout} label={'行业类型'}>
            {getFieldDecorator('industry', {
              initialValue: target
                ? target.industry
                  ? target.industry.map(item => item.id)
                  : null
                : null,
              rules: [
                { required: true, message: '请选择行业类型' },
                { validator: lengthValidator },
              ],
            })(
              <Checkbox.Group
                disabled={disabled}
                options={industry.map(item => ({
                  label: item.title,
                  value: item.id,
                }))}
              />,
            )}
          </Form.Item>

          <Form.Item {...formItemLayout} label={'投资金额'}>
            {getFieldDecorator('amount', {
              initialValue: target ? target.amount : null,
              rules: [{ required: true, message: '请填写投资金额' }],
            })(
              <InputNumber
                disabled={disabled}
                min={1}
                style={{ width: 200 }}
                placeholder="请填写投资金额"
              />,
            )}
            {'  '}万元
          </Form.Item>
          <Form.Item {...formItemLayout} label={'资金类型'}>
            {getFieldDecorator('type', {
              initialValue: target ? (target.type ? target.type.map(item => item.id) : null) : null,
              rules: [
                { required: true, message: '请选择资金类型' },
                { validator: lengthValidator },
              ],
            })(
              <Checkbox.Group
                disabled={disabled}
                options={type.map(item => ({
                  label: item.title,
                  value: item.id,
                }))}
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'所在地区'}>
            {getFieldDecorator('area', {
              initialValue: area,
              rules: [{ required: true, message: '请选择所在地区' }],
            })(<Cascader disabled={disabled} placeholder="请选择所在地区" options={areaList} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'投资地区'}>
            {getFieldDecorator('invest_area', {
              initialValue: target
                ? target.invest_area
                  ? target.invest_area.map(item => item.id)
                  : null
                : null,
              rules: [
                { required: true, message: '请选择投资地区' },
                { validator: lengthValidator },
              ],
            })(
              <Checkbox.Group
                disabled={disabled}
                options={invest_area.map(item => ({
                  label: item.title,
                  value: item.id,
                }))}
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'投资方式'} required>
            <Radio.Group
              disabled={disabled}
              onChange={e => setCategory(e.target.value)}
              value={category}
            >
              <Radio value={IFModeEnum.EQUITY}>股权</Radio>
              <Radio value={IFModeEnum.CLAIM}>债权</Radio>
            </Radio.Group>
          </Form.Item>

          {IFModeEnum.EQUITY === category ? (
            <>
              <Form.Item {...formItemLayout} label={'参股类型'}>
                {getFieldDecorator('equity_type', {
                  initialValue: target ? (target.equity_type ? target.equity_type.id : null) : null,
                  rules: [{ required: true, message: '请选择参股类型' }],
                })(
                  <Select disabled={disabled} style={{ width: 200 }} placeholder="请选择参股类型">
                    {equity_type.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'投资阶段'}>
                {getFieldDecorator('stage', {
                  initialValue: target
                    ? target.stage
                      ? target.stage.map(item => item.id)
                      : null
                    : null,
                  rules: [{ required: true, message: '请选择投资阶段' }],
                })(
                  <Checkbox.Group
                    disabled={disabled}
                    options={stage.map(item => ({
                      label: item.title,
                      value: item.id,
                    }))}
                  />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'投资期限'}>
                {getFieldDecorator('term', {
                  initialValue: target ? target.term : null,
                  rules: [{ required: true, message: '请填写投资期限' }],
                })(
                  <InputNumber
                    disabled={disabled}
                    min={1}
                    style={{ width: 200 }}
                    placeholder="请填写投资期限"
                  />,
                )}
                {'  '}年
              </Form.Item>
              <Form.Item {...formItemLayout} label={'投资类型'}>
                {getFieldDecorator('invest_type', {
                  initialValue: target
                    ? target.invest_type
                      ? target.invest_type.map(item => item.id)
                      : null
                    : null,
                  rules: [{ required: true, message: '请选择投资类型' }],
                })(
                  <Checkbox.Group
                    disabled={disabled}
                    options={invest_type.map(item => ({
                      label: item.title,
                      value: item.id,
                    }))}
                  />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'占股比例'}>
                {getFieldDecorator('ratio', {
                  initialValue: target ? (target.ratio ? target.ratio.id : null) : null,
                  rules: [{ required: true, message: '请选择占股比例' }],
                })(
                  <Select disabled={disabled} style={{ width: 200 }} placeholder="请选择占股比例">
                    {ratio.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'前期费用'}>
                {getFieldDecorator('pre_payment', {
                  initialValue: target ? target.pre_payment : null,
                })(
                  <Input disabled={disabled} style={{ width: 500 }} placeholder="请填写前期费用" />,
                )}
              </Form.Item>
            </>
          ) : null}

          {IFModeEnum.CLAIM === category ? (
            <>
              <Form.Item {...formItemLayout} label={'最低回报要求'}>
                {getFieldDecorator('return', {
                  initialValue: target ? target.return : null,
                  rules: [{ required: true, message: '请填写最低回报要求' }],
                })(
                  <Input
                    disabled={disabled}
                    style={{ width: 500 }}
                    placeholder="请填写最低回报要求"
                  />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'风控要求'}>
                {getFieldDecorator('risk', {
                  initialValue: target ? (target.risk ? target.risk.id : null) : null,
                  rules: [{ required: true, message: '请选择风控要求' }],
                })(
                  <Select disabled={disabled} style={{ width: 200 }} placeholder="请选择风控要求">
                    {risk.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.title}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'抵质押物类型'}>
                {getFieldDecorator('pledge', {
                  initialValue: target ? target.pledge : null,
                })(
                  <Input
                    disabled={disabled}
                    style={{ width: 500 }}
                    placeholder="请填写抵质押物类型"
                  />,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label={'抵质押物折扣率'}>
                {getFieldDecorator('discount', {
                  initialValue: target ? target.discount : null,
                })(
                  <InputNumber
                    disabled={disabled}
                    min={1}
                    max={10}
                    step={0.1}
                    style={{ width: 200 }}
                    placeholder="请填写投资金额"
                  />,
                )}
                {'  '}折
              </Form.Item>
            </>
          ) : null}

          <Form.Item {...formItemLayout} label={'可提供资料'}>
            {getFieldDecorator('data', {
              initialValue: target ? (target.data ? target.data.map(item => item.id) : null) : null,
              rules: [{ required: true, message: '请选择可提供资料' }],
            })(
              <Checkbox.Group
                disabled={disabled}
                options={data.map(item => ({
                  label: item.title,
                  value: item.id,
                }))}
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'资金详情'}>
            {getFieldDecorator('info', {
              initialValue: target ? target.info : null,
              rules: [{ required: true, message: '请填写资金详情' }],
            })(<TextArea disabled={disabled} rows={5} placeholder="请填写资金详情" />)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item {...submitFormLayout}>
        <Button disabled={disabled} type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
});

export default withRouter(props => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [tabKey, setTabKey] = useState('detail');

  const [areaList, setAreaList] = useState([]);
  const [area, setArea] = useState([]);

  const [target, setTarget] = useState(null);
  const [category, setCategory] = useState(IFModeEnum.EQUITY);

  const [loading, setLoading] = useState(true);

  const client = useApolloClient();

  useEffect(() => {
    (async () => {
      const list = await getAreaList(client);
      setAreaList(list);

      if (!!id) {
        const result = await client.query({
          query: Q_GET_CAPITAL,
          notifyOnNetworkStatusChange: true,
          fetchPolicy: 'no-cache',
          variables: { id },
        });

        const { capital } = result.data;
        setLoading(result.loading);
        setTarget(capital);
        setCategory(capital.category);

        const areas =
          capital && capital.area
            ? toGetParentArrayByChildNode(list, { id: capital.area.id })
            : null;

        setArea(areas ? areas.map(item => item.id) : null);
      } else {
        setLoading(false);
      }
    })();
  }, [id]);

  const [createCapital] = useMutation(M_CREATE_CAPITAL, {
    update: (proxy, { data }) => {
      if (data && data.createCapital) {
        message.success('保存成功');
        router.goBack();
      }
    },
  });

  const [updateCapital] = useMutation(M_UPDATE_CAPITAL, {
    update: (proxy, { data }) => {
      if (data) {
        message.success('保存成功');
        router.goBack();
      }
    },
  });

  const mutation = id ? updateCapital : createCapital;

  const onUpload = async file => {
    const res = await uploadOne(file);

    if (!!res && res.relativePath) {
      setCover(res.relativePath);
    }
  };

  let tabList = {
    detail: {
      name: '详细信息',
      render: () => (
        <DetailForm
          target={target || {}}
          mutation={mutation}
          area={area}
          category={category}
          areaList={areaList}
          setCategory={setCategory}
        />
      ),
    },
  };

  return (
    <PageHeaderWrapper
      title={target ? '编辑' : '新增'}
      extra={action}
      className={styles.pageHeader}
      content={null}
      extraContent={null}
    >
      <div className={styles.main}>
        <GridContent>
          <StandardTabList
            loading={loading}
            activeTabKey={tabKey}
            onActiveTabKeyChange={key => setTabKey(key)}
            tabList={tabList}
          />
        </GridContent>
      </div>
    </PageHeaderWrapper>
  );
});

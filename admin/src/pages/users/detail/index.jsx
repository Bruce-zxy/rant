import ImageCropper from '@/components/ImageCropper';
import StandardTabList from '@/components/StandardTabList';
import { uploadOne } from '@/utils/fetch';
import { IdentityMaps, UserStatusMaps } from '@/utils/global';
import Logger from '@/utils/logger';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Affix,
  Avatar,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Dropdown,
  Form,
  Icon,
  Input,
  message,
  Select,
  Skeleton,
  Statistic,
} from 'antd';
import React, { Fragment, useState } from 'react';
import { router, withRouter } from 'umi';
import { formatMessage } from 'umi-plugin-react/locale';
import { M_UPDATE_USER, Q_GET_USER, M_CREATE_USER } from '../gql/user';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const action = (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      if (isMobile) {
        return (
          <Dropdown.Button
            type="primary"
            icon={<Icon type="down" />}
            overlay={mobileMenu}
            placement="bottomRight"
          >
            主操作
          </Dropdown.Button>
        );
      }

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

const extra = (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value="待审批" />
  </div>
);

const PageHeaderContent = ({ user }) => {
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={user.avatar} />
      </div>
      <div className={styles.content}>{renderDescription(user)}</div>
    </div>
  );
};

const renderDescription = user => (
  <RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={1}>
        <Descriptions.Item label="账户名">{user.account}</Descriptions.Item>
        <Descriptions.Item label="身份">{IdentityMaps[user.identity]}</Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);

const onAvatarUpload = async (file, target, mutation) => {
  Logger.log('upload file:', file);

  const res = await uploadOne(file);

  Logger.log('res:', res);

  if (!!res && res.relativePath) {
    mutation({
      variables: {
        id: target.id,
        data: {
          avatar: res.relativePath,
        },
      },
    });
  }
};

const BasicForm = Form.create()(props => {
  const { target, mutation, form } = props;

  const { getFieldDecorator, getFieldValue } = form;

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
        span: 12,
      },
      md: {
        span: 10,
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

  return (
    <Card bordered={false}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);

              const variables = { data: values };

              if (target.id) {
                variables.id = target.id;
              }

              mutation({ variables });
            }
          });
        }}
      >
        <FormItem {...formItemLayout} label="账户名">
          {getFieldDecorator('account', {
            initialValue: target.account,
            rules: [
              {
                required: true,
                message: '账户名不能为空',
              },
            ],
          })(<Input disabled={!!target.account} placeholder="请填写账户名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="身份">
          {getFieldDecorator('identity', {
            initialValue: target.identity,
          })(
            <Select>
              {Object.keys(IdentityMaps).map(key => (
                <Option value={key}>{IdentityMaps[key]}</Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="状态">
          {getFieldDecorator('status', {
            initialValue: target.status,
          })(
            <Select>
              {Object.keys(UserStatusMaps).map(key => (
                <Option value={parseInt(key)}>{UserStatusMaps[key]}</Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="姓名">
          {getFieldDecorator('realname', {
            initialValue: target.realname,
          })(<Input placeholder="请填写姓名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="手机号">
          {getFieldDecorator('phone', {
            initialValue: target.phone,
          })(<Input placeholder="请填写手机号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="身份证">
          {getFieldDecorator('idcard', {
            initialValue: target.idcard,
          })(<Input placeholder="请填写身份证" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          {getFieldDecorator('address', {
            initialValue: target.address,
          })(<TextArea placeholder="请填写地址" rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="公司">
          {getFieldDecorator('company', {
            initialValue: target.company,
          })(<TextArea placeholder="请填写公司" rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="简介">
          {getFieldDecorator('profile', {
            initialValue: target.profile,
          })(<TextArea placeholder="请填写简介" rows={4} />)}
        </FormItem>
        {/* <FormItem {...formItemLayout} label={<FormattedMessage id="form-basic.date.label" />}>
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'form-basic.date.required',
                }),
              },
            ],
          })(
            <RangePicker
              style={{
                width: '100%',
              }}
              placeholder={[
                formatMessage({
                  id: 'form-basic.placeholder.start',
                }),
                formatMessage({
                  id: 'form-basic.placeholder.end',
                }),
              ]}
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<FormattedMessage id="form-basic.goal.label" />}>
          {getFieldDecorator('goal', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'form-basic.goal.required',
                }),
              },
            ],
          })(
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder={formatMessage({
                id: 'form-basic.goal.placeholder',
              })}
              rows={4}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={<FormattedMessage id="form-basic.standard.label" />}
        >
          {getFieldDecorator('standard', {
            rules: [
              {
                required: true,
                message: formatMessage({
                  id: 'form-basic.standard.required',
                }),
              },
            ],
          })(
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder={formatMessage({
                id: 'form-basic.standard.placeholder',
              })}
              rows={4}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="form-basic.client.label" />
              <em className={styles.optional}>
                <FormattedMessage id="form-basic.form.optional" />
                <Tooltip title={<FormattedMessage id="form-basic.label.tooltip" />}>
                  <Icon
                    type="info-circle-o"
                    style={{
                      marginRight: 4,
                    }}
                  />
                </Tooltip>
              </em>
            </span>
          }
        >
          {getFieldDecorator('client')(
            <Input
              placeholder={formatMessage({
                id: 'form-basic.client.placeholder',
              })}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="form-basic.invites.label" />
              <em className={styles.optional}>
                <FormattedMessage id="form-basic.form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('invites')(
            <Input
              placeholder={formatMessage({
                id: 'form-basic.invites.placeholder',
              })}
            />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="form-basic.weight.label" />
              <em className={styles.optional}>
                <FormattedMessage id="form-basic.form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('weight')(
            <InputNumber
              placeholder={formatMessage({
                id: 'form-basic.weight.placeholder',
              })}
              min={0}
              max={100}
            />,
          )}
          <span className="ant-form-text">%</span>
        </FormItem> */}
        <FormItem
          {...submitFormLayout}
          style={{
            marginTop: 32,
          }}
        >
          <Button type="primary" htmlType="submit" loading={false}>
            保存
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
});

const renderContent = (data, mutation, tabKey, setTabKey) => {
  let tabList = {
    basic: {
      name: '基础信息',
      render: () => <BasicForm target={data || {}} mutation={mutation} />,
    },
  };

  if (data) {
    tabList = Object.assign(tabList, {
      avatar: {
        name: '头像',
        render: () => (
          <ImageCropper
            url={data.avatar}
            onUpload={file => onAvatarUpload(file, data, mutation)}
            width={128}
            height={128}
          />
        ),
      },
    });
  }

  return (
    <PageHeaderWrapper
      title={data ? '编辑用户' : '新增用户'}
      extra={action}
      className={styles.pageHeader}
      content={data ? <PageHeaderContent user={data} /> : null}
      extraContent={
        data ? (
          <div className={styles.moreInfo}>
            <Statistic title="状态" value={UserStatusMaps[data.status]} />
          </div>
        ) : null
      }
    >
      <div className={styles.main}>
        <GridContent>
          <StandardTabList
            activeTabKey={tabKey}
            onActiveTabKeyChange={key => setTabKey(key)}
            tabList={tabList}
          />
        </GridContent>
      </div>
    </PageHeaderWrapper>
  );
};

export default withRouter(props => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [tabKey, setTabKey] = useState('basic');

  const [createUser] = useMutation(M_CREATE_USER, {
    update: (proxy, { data }) => {
      Logger.log('create result data:', data);

      if (data && data.createUser) {
        message.success('保存成功');
        router.replace(`/users/detail/${data.createUser.id}`);
      }
    },
  });

  if (!id) return renderContent(null, createUser, tabKey, setTabKey);

  const { loading, data, refetch } = useQuery(Q_GET_USER, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  const [updateUser] = useMutation(M_UPDATE_USER, {
    update: (proxy, { data }) => {
      Logger.log('update result data:', data);

      if (data) {
        refetch();
        message.success('保存成功');
      }
    },
  });

  if (loading || !data) return <Skeleton loading={loading} />;

  const user = data.user || {};

  return renderContent(user, updateUser, tabKey, setTabKey);
});

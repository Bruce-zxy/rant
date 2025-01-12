import ImageCropper from '@/components/ImageCropper';
import StandardTabList from '@/components/StandardTabList';
import { M_CREATE_SUCCESS_CASE, M_UPDATE_SUCCESS_CASE, Q_GET_SUCCESS_CASE } from '@/gql';
import { uploadOne } from '@/utils/fetch';
import { buildingQuery } from '@/utils/global';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Affix, Button, Card, DatePicker, Form, Input, InputNumber, message, Switch } from 'antd';
import moment from 'moment';
import React, { Fragment, useState } from 'react';
import { router, withRouter } from 'umi';
import styles from './style.less';

const FormItem = Form.Item;
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

const onUpload = async (file, target, mutation) => {
  const res = await uploadOne(file);

  if (!!res && res.relativePath) {
    mutation({
      variables: {
        id: target.id,
        data: {
          cover: res.relativePath,
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

  return (
    <Card bordered={false}>
      <Form
        onSubmit={e => {
          e.preventDefault();
          form.validateFields((err, values) => {
            if (!err) {
              const variables = { data: values };

              if (target.id) {
                variables.id = target.id;
              }

              mutation({ variables });
            }
          });
        }}
      >
        <FormItem {...formItemLayout} label="标题">
          {getFieldDecorator('title', {
            initialValue: target.title,
            rules: [
              {
                required: true,
                message: '标题不能为空',
              },
            ],
          })(<Input placeholder="请填写标题" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          {getFieldDecorator('link', {
            initialValue: target.link,
          })(<Input placeholder="请填写地址" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="排序">
          {getFieldDecorator('sort', {
            initialValue: target.sort || 0,
          })(<InputNumber min={0} placeholder="请填写排序" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否发布">
          {getFieldDecorator('is_published', {
            initialValue: target.is_published,
          })(
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              defaultChecked={target.is_published}
            />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="发布时间">
          {getFieldDecorator('publish_at', {
            initialValue: moment(target.publish_at),
          })(<DatePicker showTime />)}
        </FormItem>
        <FormItem {...formItemLayout} label="摘要">
          {getFieldDecorator('summary', {
            initialValue: target.summary,
          })(<TextArea placeholder="请填写摘要" rows={4} />)}
        </FormItem>
        <FormItem
          {...submitFormLayout}
          style={{
            marginTop: 32,
          }}
        >
          <Button type="primary" htmlType="submit">
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
      cover: {
        name: '图片',
        render: () => (
          <ImageCropper
            url={data.cover}
            onUpload={file => onUpload(file, data, mutation)}
            width={283}
            height={180}
          />
        ),
      },
    });
  }

  return (
    <PageHeaderWrapper
      title={data ? '编辑' : '新增'}
      extra={action}
      className={styles.pageHeader}
      content={null}
      extraContent={null}
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
  const [tabKey, setTabKey] = useState('basic');

  const {
    match: {
      params: { id },
    },
  } = props;

  let result = {};

  if (!!id) {
    result = useQuery(Q_GET_SUCCESS_CASE, {
      notifyOnNetworkStatusChange: true,
      variables: { id, queryString: buildingQuery({ join: [{ field: 'category' }] }) },
    });
  }

  const { data = {}, refetch = () => {} } = result;

  const [createSuccessCase] = useMutation(M_CREATE_SUCCESS_CASE, {
    update: (proxy, { data }) => {
      if (data && data.createSuccessCase) {
        message.success('保存成功');
        router.replace(`/contents/success-cases/detail/${data.createSuccessCase.id}`);
      }
    },
  });

  const [updateSuccessCase] = useMutation(M_UPDATE_SUCCESS_CASE, {
    update: (proxy, { data }) => {
      if (data) {
        refetch();
        message.success('保存成功');
      }
    },
  });

  const { successCase } = data;

  return renderContent(successCase, id ? updateSuccessCase : createSuccessCase, tabKey, setTabKey);
});

import ImageCropper from '@/components/ImageCropper';
import StandardTabList from '@/components/StandardTabList';
import { M_CREATE_SEO, M_UPDATE_SEO, Q_GET_SEO } from '@/gql';
import { uploadOne } from '@/utils/fetch';
import { buildingQuery } from '@/utils/global';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Affix,
  Button,
  Card,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
  Switch,
} from 'antd';
import React, { Fragment, useState } from 'react';
import { router, withRouter } from 'umi';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

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

const onUpload = async (file, target, mutation) => {
  const res = await uploadOne(file);

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
        <FormItem {...formItemLayout} label="路径">
          {getFieldDecorator('path', {
            initialValue: target.path,
            rules: [
              {
                required: true,
                message: '路径不能为空',
              },
            ],
          })(<Input placeholder="请填写路径" />)}
        </FormItem>
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
        <FormItem {...formItemLayout} label="关键词">
          {getFieldDecorator('keywords', {
            initialValue: target.keywords,
          })(<TextArea placeholder="请填写关键词" rows={4} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="描述">
          {getFieldDecorator('description', {
            initialValue: target.description,
          })(<TextArea placeholder="请填写描述" rows={4} />)}
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

  const { loading, data, refetch } = useQuery(Q_GET_SEO, {
    notifyOnNetworkStatusChange: true,
    variables: { id: id || '', queryString: buildingQuery({ join: [{ field: 'category' }] }) },
  });

  const [createSeo] = useMutation(M_CREATE_SEO, {
    update: (proxy, { data }) => {
      if (data && data.createSeo) {
        message.success('保存成功');
        router.replace(`/contents/seo/detail/${data.createSeo.id}`);
      }
    },
  });

  const [updateSeo] = useMutation(M_UPDATE_SEO, {
    update: (proxy, { data }) => {
      if (data) {
        refetch();
        message.success('保存成功');
      }
    },
  });

  if (loading || !data) return <Skeleton loading={loading} />;

  const { seo } = data;

  return renderContent(id ? seo : null, id ? updateSeo : createSeo, tabKey, setTabKey);
});
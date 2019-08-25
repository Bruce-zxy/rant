import StandardActions from '@/components/StandardActions';
import StandardRow from '@/components/StandardRow';
import StandardTable from '@/components/StandardTable';
import { M_DELETE_EXPERT, M_UPDATE_EXPERT, Q_GET_EXPERTS } from '@/gql';
import { buildingQuery } from '@/utils/global';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { Affix, Avatar, Col, message, Row, Skeleton, Switch } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, router } from 'umi';

export default () => {
  const defaultVariables = {
    page: 0,
    limit: 10,
    join: [{ field: 'category' }],
    sort: [{ field: 'sort', order: 'DESC' }, { field: 'create_at', order: 'DESC' }],
  };
  const [variables, setVariables] = useState(defaultVariables);
  const [selectedRows, setSelectedRows] = useState([]);

  const client = useApolloClient();

  const { loading, data, refetch } = useQuery(Q_GET_EXPERTS, {
    notifyOnNetworkStatusChange: true,
    variables: { queryString: buildingQuery(defaultVariables) },
  });

  const [updateExpert] = useMutation(M_UPDATE_EXPERT, {
    update: (proxy, { data }) => {
      if (data.updateExpert) {
        message.success('操作成功');
        refetch();
      } else {
        message.error('操作失败');
      }
    },
  });

  useEffect(() => {
    const queryString = buildingQuery(variables);

    refetch({ queryString });
  }, [variables]);

  const { queryExpert } = data;

  if (!queryExpert) return <Skeleton loading={loading} active avatar />;

  const dataSource = queryExpert.data;
  const total = queryExpert.total;

  const columns = [
    {
      title: '详情',
      dataIndex: 'id',
      render: (val, row) => {
        return (
          <Fragment>
            <Link to={`/experts/detail/${val}`}>详情</Link>
          </Fragment>
        );
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: val => <Avatar src={val} />,
    },
    {
      title: '名称',
      dataIndex: 'name',
      search: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      search: true,
    },
    {
      title: '公司',
      dataIndex: 'company',
      search: true,
    },
    {
      title: '职位',
      dataIndex: 'position',
      search: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      sorter: true,
    },
    {
      title: '是否发布',
      dataIndex: 'is_published',
      render: (val, record) => (
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          checked={!!val}
          onChange={checked => {
            client.mutate({
              mutation: M_UPDATE_EXPERT,
              variables: { id: record.id, data: { is_published: checked } },
              update: (proxy, { data }) => {
                if (data.deleteExpert) {
                  message.success('操删除成功');
                  refetch();
                }
              },
            });
          }}
        />
      ),
      filterMultiple: false,
      filters: [{ text: '是', value: true }, { text: '否', value: false }],
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''),
      sorter: true,
    },
  ];

  const pagination = {
    size: 'small',
    total,
    current: variables.page,
    pageSize: variables.limit,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `共 ${total} 条记录`,
  };

  const actions = [
    { name: '刷新', icon: 'reload', action: () => refetch() },
    { name: '新增', icon: 'file-add', action: () => router.push('/experts/create') },
    {
      name: '删除',
      icon: 'delete',
      action: () => {
        client.mutate({
          mutation: M_DELETE_EXPERT,
          variables: { ids: selectedRows.map(item => item.id).join(',') },
          update: (proxy, { data }) => {
            if (data.deleteExpert) {
              message.success('操删除成功');
              refetch();
            }
          },
        });
      },
      disabled: selectedRows.length <= 0,
      confirm: true,
      confirmTitle: `确定要删除吗?`,
    },
    { name: '导入', icon: 'import', action: () => refetch() },
    { name: '导出', icon: 'export', action: () => refetch() },
  ];

  return (
    <Fragment>
      <PageHeaderWrapper>
        <StandardRow>
          <Row gutter={16}>
            <Col lg={6}>
              <Affix style={{ display: 'inline-block' }} offsetTop={80}>
                <StandardActions actions={actions} />
              </Affix>
            </Col>
          </Row>
        </StandardRow>

        <StandardTable
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          state={variables}
          onChange={values => setVariables({ ...values })}
          onRowSelectionChange={selectedRows => setSelectedRows(selectedRows)}
        />
      </PageHeaderWrapper>
    </Fragment>
  );
};

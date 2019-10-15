import StandardActions from '@/components/StandardActions';
import StandardRow from '@/components/StandardRow';
import StandardTable from '@/components/StandardTable';
import { Q_GET_CUSTOMERS, M_DELETE_CUSTOMER } from '@/gql';
import { canCreateAny, canReadAny, canUpdateOwn, canDeleteAny } from '@/utils/access-control';
import { ProjectStatusEnum } from '@/utils/enum';
import { ExcelHelper } from '@/utils/excel';
import { buildingQuery, paramsAuth, ProjectStatusMaps } from '@/utils/global';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { Affix, Button, Col, Divider, message, Popconfirm, Row, Skeleton, Upload } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { M_APPROVAL_CUSTOMER } from '../gql';
import { post } from '@/utils/super-fetch';

const PATH = '/customer';
const AUTH_RESOURCE = '/customer';

export default () => {
  const defaultVariables = {
    page: 0,
    limit: 10,
    sort: [{ field: 'create_at', order: 'DESC' }],
  };
  const [variables, setVariables] = useState(defaultVariables);
  const [selectedRows, setSelectedRows] = useState([]);

  const client = useApolloClient();

  const { loading, data, refetch } = useQuery(Q_GET_CUSTOMERS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      queryString: buildingQuery(paramsAuth(AUTH_RESOURCE, defaultVariables)),
    },
  });

  useEffect(() => {
    const queryString = buildingQuery(paramsAuth(AUTH_RESOURCE, variables));

    refetch({ queryString });
  }, [variables]);

  const { queryCustomer } = data;

  if (!queryCustomer) return <Skeleton loading={loading} active avatar />;

  const renderActions = record => {
    if (ProjectStatusEnum.PENDING !== record.status) return null;
    return (
      <Fragment>
        {canUpdateOwn(AUTH_RESOURCE) ? (
          <Fragment>
            <Popconfirm
              title="确定要审核吗?"
              onConfirm={() => {
                client.mutate({
                  mutation: M_APPROVAL_CUSTOMER,
                  variables: {
                    data: {
                      id: record.id,
                      status: ProjectStatusEnum.CHECKED,
                    },
                  },
                  update: (cache, { data }) => {
                    if (data.approvalCustomer) {
                      message.success('操作成功');
                      refetch();
                    }
                  },
                });
              }}
            >
              <a href="#">[审核]</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm
              title="确定要驳回吗?"
              onConfirm={() => {
                client.mutate({
                  mutation: M_APPROVAL_CUSTOMER,
                  variables: {
                    data: {
                      id: record.id,
                      status: ProjectStatusEnum.REJECTED,
                    },
                  },
                  update: (cache, { data }) => {
                    if (data.approvalCustomer) {
                      message.success('操作成功');
                      refetch();
                    }
                  },
                });
              }}
            >
              <a href="#">[驳回]</a>
            </Popconfirm>
          </Fragment>
        ) : null}
      </Fragment>
    );
  };

  const dataSource = queryCustomer.data;
  const total = queryCustomer.total;

  const columns = [
    {
      title: '企业全称',
      dataIndex: 'company',
      search: true,
    },
    {
      title: '机构类别',
      dataIndex: 'org_type',
      search: true,
    },
    {
      title: '地区',
      dataIndex: 'area_path',
      search: true,
    },
    {
      title: '参会人姓名(主)',
      dataIndex: 'participant1name',
      search: true,
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const participant = info.participants[0];
        return participant ? participant.realname : null;
      },
    },
    {
      title: '参会人电话(主)',
      dataIndex: 'participant1phone',
      search: true,
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const participant = info.participants[0];
        return participant ? participant.phone : null;
      },
    },
    {
      title: '参会人姓名(陪)',
      dataIndex: 'participant2name',
      search: true,
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const participant = info.participants.length >= 2 ? info.participants[1] : null;
        return participant ? participant.realname : null;
      },
    },
    {
      title: '参会人电话(陪)',
      dataIndex: 'participant2phone',
      search: true,
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const participant = info.participants.length >= 2 ? info.participants[1] : null;
        return participant ? participant.phone : null;
      },
    },
    {
      title: '7日晚餐',
      dataIndex: 'dinner5',
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const boardAndLodging = info.board_and_lodging || [];

        return boardAndLodging.includes('dinner5') ? '需要' : '不需要';
      },
    },
    {
      title: '7日住宿（含早餐）',
      dataIndex: 'stay5',
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const boardAndLodging = info.board_and_lodging || [];

        return boardAndLodging.includes('stay5') ? '需要' : '不需要';
      },
    },
    {
      title: '8日午餐',
      dataIndex: 'lunch6',
      render: (_, row) => {
        const info = JSON.parse(row.ex_info);
        const boardAndLodging = info.board_and_lodging || [];

        return boardAndLodging.includes('lunch6') ? '需要' : '不需要';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => ProjectStatusMaps[val],
      filters: Object.keys(ProjectStatusMaps).map(key => ({
        text: ProjectStatusMaps[key],
        value: key,
      })),
    },
    {
      title: '报名时间',
      dataIndex: 'create_at',
      render: val => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      sorter: true,
    },
    {
      title: '操作',
      render: (val, record) => renderActions(record),
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

  const uploadProps = {
    accept:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    showUploadList: false,
    beforeUpload: async file => {
      message.loading('正在导入...');
      const data = await ExcelHelper.import(file);
      const res = await post('/api/customer/import', data);
      message.destroy();
      if (res.isSuccess) {
        message.success('导入成功');
      } else {
        message.error('导入失败:' + res.message.message);
      }
      refetch();
      return false;
    },
  };

  const actions = [
    { name: '刷新', icon: 'reload', action: () => refetch() },
    {
      name: '导入',
      icon: 'import',
      render: action => (
        <Upload {...uploadProps}>
          <Button disabled={action.disabled} icon={action.icon} />
        </Upload>
      ),
      hide: !canCreateAny(AUTH_RESOURCE),
    },
    {
      name: '删除',
      icon: 'delete',
      action: () => {
        client.mutate({
          mutation: M_DELETE_CUSTOMER,
          variables: { ids: selectedRows.map(item => item.id).join(',') },
          update: (proxy, { data }) => {
            if (data.deleteCustomer) {
              message.success('删除成功');
              refetch();
            }
          },
        });
      },
      disabled: selectedRows.length <= 0,
      hide: !canDeleteAny(AUTH_RESOURCE),
      confirm: true,
      confirmTitle: `确定要删除吗?`,
    },
    {
      name: '导出',
      icon: 'export',
      action: () => {
        const excelColumns = columns
          .filter(item => !!item.dataIndex)
          .map(item => ({ header: item.title, key: item.dataIndex, ...item }));
        ExcelHelper.export(
          dataSource,
          excelColumns,
          '促进会报名_' + moment().format('YYYY_MM_DD_HH_mm_ss'),
        );
      },
      hide: !canReadAny(AUTH_RESOURCE),
    },
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

import LogReader from '@/components/LogReader';
import OrgSelector from '@/components/OrgSelector';
import StandardActions from '@/components/StandardActions';
import StandardConfirm from '@/components/StandardConfirm';
import StandardRow from '@/components/StandardRow';
import StandardTable from '@/components/StandardTable';
import UserSelector from '@/components/UserSelector';
import { Q_GET_APPLY_PRODUCTS } from '@/gql';
import { canCreateAny, canReadAny, canUpdateAny, canUpdateOwn } from '@/utils/access-control';
import { LogTypeEnum, ProjectStatusEnum } from '@/utils/enum';
import { buildingQuery, filterOrg, paramsAuth, ProjectStatusMaps } from '@/utils/global';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { Affix, Col, Divider, message, Popconfirm, Row, Skeleton } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { M_APPROVAL_APPLY_PRODUCT } from '../gql';
import { ExcelHelper } from '@/utils/excel';

const PATH = '/apply/apply-product';
const AUTH_RESOURCE = '/apply-product';

export default () => {
  const defaultVariables = {
    page: 0,
    limit: 10,
    sort: [{ field: 'create_at', order: 'DESC' }],
  };
  const [variables, setVariables] = useState(defaultVariables);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);
  const [cancelledVisible, setCancelledVisible] = useState(false);
  const [orgSelectorVisible, setOrgSelectorVisible] = useState(false);
  const [userSelectorVisible, setUserSelectorVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  const client = useApolloClient();

  const { loading, data, refetch } = useQuery(Q_GET_APPLY_PRODUCTS, {
    notifyOnNetworkStatusChange: true,
    variables: { queryString: buildingQuery(paramsAuth(AUTH_RESOURCE, defaultVariables)) },
  });

  useEffect(() => {
    const queryString = buildingQuery(paramsAuth(AUTH_RESOURCE, variables));

    refetch({ queryString });
  }, [variables]);

  const { queryApplyProduct } = data;

  if (!queryApplyProduct) return <Skeleton loading={loading} active avatar />;

  const dataSource = queryApplyProduct.data;
  const total = queryApplyProduct.total;

  const renderActions = record => (
    <Fragment>
      {ProjectStatusEnum.PENDING === record.status && canUpdateAny(AUTH_RESOURCE) ? (
        <Fragment>
          <Popconfirm
            title="确定要审核吗?"
            onConfirm={() => {
              client.mutate({
                mutation: M_APPROVAL_APPLY_PRODUCT,
                variables: {
                  data: {
                    id: record.id,
                    status: ProjectStatusEnum.CHECKED,
                  },
                },
                update: (cache, { data }) => {
                  if (data.approvalApplyProduct) {
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
          <a
            href="javascript:;"
            onClick={() => {
              setCurrent(record);
              setVisible(true);
            }}
          >
            [驳回]
          </a>
          <Divider type="vertical" />
        </Fragment>
      ) : null}
      {(ProjectStatusEnum.CHECKED === record.status ||
        ProjectStatusEnum.WAITING === record.status) &&
      canUpdateAny(AUTH_RESOURCE) ? (
        <Fragment>
          <a
            href="javascript:;"
            onClick={() => {
              setCurrent(record);
              setOrgSelectorVisible(true);
            }}
          >
            [{`${ProjectStatusEnum.CHECKED === record.status ? '' : '重新'}`}分配部门]
          </a>
          <Divider type="vertical" />
        </Fragment>
      ) : null}
      {(ProjectStatusEnum.WAITING === record.status ||
        ProjectStatusEnum.FOLLOWING === record.status) &&
      canUpdateAny(AUTH_RESOURCE) ? (
        <Fragment>
          <a
            href="javascript:;"
            onClick={() => {
              setCurrent(record);
              setUserSelectorVisible(true);
            }}
          >
            [{`${ProjectStatusEnum.WAITING === record.status ? '' : '重新'}`}分配业务员]
          </a>
          <Divider type="vertical" />
        </Fragment>
      ) : null}
      {ProjectStatusEnum.FOLLOWING === record.status && canUpdateOwn(AUTH_RESOURCE) ? (
        <Fragment>
          <a
            href="javascript:;"
            onClick={() => {
              setCurrent(record);
              setFollowingVisible(true);
            }}
          >
            [跟进]
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要完成吗?"
            onConfirm={() => {
              client.mutate({
                mutation: M_APPROVAL_APPLY_PRODUCT,
                variables: {
                  data: {
                    id: record.id,
                    status: ProjectStatusEnum.FINISHED,
                  },
                },
                update: (cache, { data }) => {
                  if (data.approvalApplyProduct) {
                    message.success('操作成功');
                    refetch();
                  }
                },
              });
            }}
          >
            <a href="#">[完成]</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a
            href="javascript:;"
            onClick={() => {
              setCurrent(record);
              setCancelledVisible(true);
            }}
          >
            [作废]
          </a>
          <Divider type="vertical" />
        </Fragment>
      ) : null}
      <a
        href="javascript:;"
        onClick={() => {
          setCurrent(record);
          setLogVisible(true);
        }}
      >
        [日志]
      </a>
    </Fragment>
  );

  const columns = [
    {
      title: '申请人',
      dataIndex: 'applicant.realname',
      search: true,
    },
    {
      title: '产品',
      dataIndex: 'product.name',
      search: true,
    },
    {
      title: '申请人电话',
      dataIndex: 'applicant.phone',
      search: true,
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
      title: '部门',
      dataIndex: 'org.id',
      render: (val, record) => (record.org ? record.org.title : ''),
      treeSelector: true,
      treeFilters: filterOrg(AUTH_RESOURCE),
    },
    {
      title: '业务员',
      dataIndex: 'own.realname',
      search: true,
    },
    {
      title: '申请时间',
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

  const actions = [
    { name: '刷新', icon: 'reload', action: () => refetch() },
    { name: '导入', icon: 'import', action: () => refetch(), hide: !canCreateAny(AUTH_RESOURCE) },
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
          '金融服务_' + moment().format('YYYY_MM_DD_HH_mm_ss'),
        );
      },
      hide: !canReadAny(AUTH_RESOURCE),
    },
  ];

  return (
    <Fragment>
      <PageHeaderWrapper>
        <LogReader
          title="日志"
          target={current ? current.id : null}
          type={LogTypeEnum.PRODUCT}
          visible={logVisible}
          setVisible={setLogVisible}
        />
        <UserSelector
          title="请选择要分配的业务员"
          orgTree={filterOrg(AUTH_RESOURCE)}
          visible={userSelectorVisible}
          setVisible={setUserSelectorVisible}
          onConfirm={own => {
            client.mutate({
              mutation: M_APPROVAL_APPLY_PRODUCT,
              variables: {
                data: {
                  id: current.id,
                  status: ProjectStatusEnum.FOLLOWING,
                  own,
                },
              },
              update: (proxy, { data }) => {
                if (data.approvalApplyProduct) {
                  message.success('操作成功');
                  refetch();
                }
              },
            });
          }}
        />
        <OrgSelector
          title="请选择要分配的部门"
          data={filterOrg(AUTH_RESOURCE)}
          visible={orgSelectorVisible}
          setVisible={setOrgSelectorVisible}
          onConfirm={org => {
            client.mutate({
              mutation: M_APPROVAL_APPLY_PRODUCT,
              variables: {
                data: {
                  id: current.id,
                  status: ProjectStatusEnum.WAITING,
                  org,
                },
              },
              update: (proxy, { data }) => {
                if (data.approvalApplyProduct) {
                  message.success('操作成功');
                  refetch();
                }
              },
            });
          }}
        />
        <StandardConfirm
          title="请输入驳回理由"
          visible={visible}
          setVisible={setVisible}
          onConfirm={reason => {
            client.mutate({
              mutation: M_APPROVAL_APPLY_PRODUCT,
              variables: {
                data: {
                  id: current.id,
                  status: ProjectStatusEnum.REJECTED,
                  reason,
                },
              },
              update: (proxy, { data }) => {
                if (data.approvalApplyProduct) {
                  message.success('操作成功');
                  refetch();
                }
              },
            });
          }}
        />
        <StandardConfirm
          title="请输入跟进日志"
          visible={followingVisible}
          setVisible={setFollowingVisible}
          onConfirm={reason => {
            client.mutate({
              mutation: M_APPROVAL_APPLY_PRODUCT,
              variables: {
                data: {
                  id: current.id,
                  status: ProjectStatusEnum.FOLLOWING,
                  reason,
                },
              },
              update: (proxy, { data }) => {
                if (data.approvalApplyProduct) {
                  message.success('操作成功');
                  refetch();
                }
              },
            });
          }}
        />
        <StandardConfirm
          title="请输入作废理由"
          visible={cancelledVisible}
          setVisible={setCancelledVisible}
          onConfirm={reason => {
            client.mutate({
              mutation: M_APPROVAL_APPLY_PRODUCT,
              variables: {
                data: {
                  id: current.id,
                  status: ProjectStatusEnum.CANCELLED,
                  reason,
                },
              },
              update: (proxy, { data }) => {
                if (data.approvalApplyProduct) {
                  message.success('操作成功');
                  refetch();
                }
              },
            });
          }}
        />

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

import RightContent from '@/components/GlobalHeader/RightContent';
import BlankLayout from '@/layouts/BlankLayout';
import Auth, { AccessAction, check } from '@/utils/access-control';
import { fetchCurrentUser } from '@/utils/global';
import logger from '@/utils/logger';
import ProLayout from '@ant-design/pro-layout';
import { Layout } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import logo from '../assets/logo.svg';

const { Footer } = Layout;

const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };

    return check(localItem.path, AccessAction.READ_ANY) ||
      check(localItem.path, AccessAction.READ_OWN)
      ? item
      : null;
  });

const footerRender = (_, defaultDom) => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      Rant ©{new Date().getFullYear()} Created by Roylin
    </Footer>
  );
};

const BasicLayout = props => {
  const { dispatch, children, settings } = props;
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'settings/getSetting',
      });
    }

    (async () => {
      const { data } = await fetchCurrentUser();

      if (data) {
        const user = data.me || {};
        const role = user.role;

        let grants = {};

        if (role && role.grants) {
          grants = JSON.parse(role.grants);
        }

        const grantsObj = {};
        grantsObj[role.id] = grants;

        Auth.user = user;
        Auth.role = role.id;
        Auth.setGrants(grantsObj);

        setCurrentUser(user);
      }
    })();
  }, []);

  /**
   * init variables
   */

  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });

  return (
    <BlankLayout>
      <ProLayout
        logo={logo}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        {children}
      </ProLayout>
    </BlankLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);

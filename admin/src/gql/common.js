import gql from 'graphql-tag';
import { F_ROLE_FIELDS } from './role';
import { F_ORG_FIELDS, F_ORG_RECURSIVE } from './org';

export const Q_FETCH_CURRENT_USER = gql`
  ${F_ROLE_FIELDS}
  ${F_ORG_FIELDS}
  ${F_ORG_RECURSIVE}

  query fetchCurrentUser {
    me {
      id
      account
      avatar
      realname
      profile
      address
      reason
      status
      isSuperAdmin
      role {
        ...RoleFields
      }
      org {
        ...OrgFields
      }
    }

    orgTrees {
      ...OrgRecursive
    }
  }
`;

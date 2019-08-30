import gql from 'graphql-tag';
import { F_METADATA_FIELDS, F_METADATA_RECURSIVE } from './metadata';

export const F_CAPITAL_FIELDS = gql`
  fragment CapitalFields on Capital {
    id
    title
    contact
    phone
    company
    views
    category
    status
    update_at
    create_at
    publish_at
    creator {
      id
      realname
    }
    area {
      id
      title
    }
    org {
      id
      title
    }
    own {
      id
      realname
    }
  }
`;

export const Q_GET_CAPITALS = gql`
  ${F_CAPITAL_FIELDS}

  query queryCapital($queryString: String!) {
    queryCapital(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...CapitalFields
      }
    }
  }
`;

export const Q_GET_CAPITAL = gql`
  ${F_CAPITAL_FIELDS}
  ${F_METADATA_FIELDS}
  ${F_METADATA_RECURSIVE}

  query getCapital($id: String!, $queryString: String! = "") {
    capital(id: $id, queryString: $queryString) {
      ...CapitalFields
    }

    metadataTrees {
      ...MetadataRecursive
    }
  }
`;

export const M_UPDATE_CAPITAL = gql`
  ${F_CAPITAL_FIELDS}

  mutation updateCapital($id: String!, $data: CapitalInput!) {
    updateCapital(id: $id, data: $data) {
      ...CapitalFields
    }
  }
`;

export const M_CREATE_CAPITAL = gql`
  ${F_CAPITAL_FIELDS}

  mutation createCapital($data: CapitalInput!) {
    createCapital(data: $data) {
      ...CapitalFields
    }
  }
`;

export const M_DELETE_CAPITAL = gql`
  mutation deleteCapital($ids: String!) {
    deleteCapital(ids: $ids)
  }
`;

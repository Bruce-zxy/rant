import gql from 'graphql-tag';

export const F_METADATA_ITEM_FIELDS = gql`
  fragment MetadataItemFields on Metadata {
    id
    title
  }
`;

export const Q_GET_PROJECT_METADATA = gql`
    ${F_METADATA_ITEM_FIELDS}

    query getProjectMetadata {
        industry: findMetadataChildrenByTitle(title: "行业") {
            ...MetadataItemFields
        }

        stage: findMetadataChildrenByTitle(title: "阶段") {
            ...MetadataItemFields
        }

        withdrawal_year: findMetadataChildrenByTitle(title: "年限") {
            ...MetadataItemFields
        }

        ratio: findMetadataChildrenByTitle(title: "比例") {
            ...MetadataItemFields
        }

        risk: findMetadataChildrenByTitle(title: "风控") {
            ...MetadataItemFields
        }

        interest: findMetadataChildrenByTitle(title: "利息") {
            ...MetadataItemFields
        }

        occupancy_time: findMetadataChildrenByTitle(title: "时长") {
            ...MetadataItemFields
        }

        exit_mode: findMetadataChildrenByTitle(title: "退出方式") {
            ...MetadataItemFields
        }

        data: findMetadataChildrenByTitle(title: "可提供资料") {
            ...MetadataItemFields
        }
    }
`;

export const Q_GET_CAPITAL_METADATA = gql`
  ${F_METADATA_ITEM_FIELDS}

  query getCapitalMetadata {
    industry: findMetadataChildrenByTitle(title: "行业") {
      ...MetadataItemFields
    }

    type: findMetadataChildrenByTitle(title: "资金类型") {
      ...MetadataItemFields
    }

    invest_area: findMetadataChildrenByTitle(title: "地区") {
      ...MetadataItemFields
    }

    equity_type: findMetadataChildrenByTitle(title: "参股类型") {
      ...MetadataItemFields
    }

    stage: findMetadataChildrenByTitle(title: "阶段") {
      ...MetadataItemFields
    }

    invest_type: findMetadataChildrenByTitle(title: "投资类型") {
      ...MetadataItemFields
    }

    ratio: findMetadataChildrenByTitle(title: "比例") {
      ...MetadataItemFields
    }

    risk: findMetadataChildrenByTitle(title: "风控") {
      ...MetadataItemFields
    }

    data: findMetadataChildrenByTitle(title: "可提供资料") {
      ...MetadataItemFields
    }
  }
`;
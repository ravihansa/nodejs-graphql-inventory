import gql from 'graphql-tag';

const categoryTypeDef = gql`

  type Category {
    id: ID!
    products: [Product]
    name: String!
    categoryKey: String!
    createdAt: String!
    updatedAt: String!
  }

  input CategoryInput {
    name: String!
    categoryKey: String!
  } 

  type Query {
    categories : [Category]!
  }

  type Mutation {
    createCategory(input: CategoryInput!): Category!
  }
`;

export default categoryTypeDef;

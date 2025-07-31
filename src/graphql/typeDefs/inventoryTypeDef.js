import gql from 'graphql-tag';

const inventoryTypeDef = gql`

  type Inventory {
    id: ID!
    product: Product!
    quantity: Int!
    status: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input InventoryInput {
    productId: ID!
    quantity: Int!
    status: Boolean
  }

  type Query {
    inventories : [Inventory]!
    inventory(productId: ID!): Inventory
  }

  type Mutation {
    createInventory(productId: ID!, input: InventoryInput!): Inventory!
  }
`;

export default inventoryTypeDef;

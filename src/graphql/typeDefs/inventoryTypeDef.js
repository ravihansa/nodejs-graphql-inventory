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

  input UpdateInventoryInput {
    quantity: Int!
    status: Boolean
  }

  type Query {
    inventories : [Inventory]!
    inventory(productId: ID!): Inventory
  }

  type Mutation {
    createInventory(input: InventoryInput!): Inventory!
    updateInventory(id: ID!, input: UpdateInventoryInput!): Inventory!
    adjustInventory(id: ID!, quantity: Int!): Inventory!
  }
`;

export default inventoryTypeDef;

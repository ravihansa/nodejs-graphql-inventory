import gql from 'graphql-tag';

const productTypeDef = gql`
   type Product {
    id: ID!
    prodId: String!
    name: String!
    description: String
    brand: String
    price: Float!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
    inventory: Inventory
  }

  input ProductInput {
    prodId: String!
    name: String!
    description: String
    brand: String
    price: Float!
    isActive: Boolean
  }

   input UpdateProductInput {
    prodId: String
    name: String
    description: String
    brand: String
    price: Float
    isActive: Boolean
  }

  type Query {
    products: [Product]!
    product(id: ID, prodId: String): Product
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean
  }
`;

export default productTypeDef;

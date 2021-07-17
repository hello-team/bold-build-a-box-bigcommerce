import axios from 'axios';

export default async (token, productId) => {
  let data = JSON.stringify({
    query: `query ProductsWithOptionSelections (
      $productId: Int!,
      # Use GraphQL Query Variables to inject your product ID
      # and Option Value IDs
    ) {
      site {
        product: product(
          entityId: $productId
        ) {
              name
              entityId
          variants{
            ... VariantOpts
          }
            }
          }
        }
        
              fragment VariantOpts on VariantConnection {
                  edges {
                  node {
                    entityId
                    options {
                       ... ProdOpts
                    }
                  }
                }
    }
    
    fragment ProdOpts on OptionConnection {
                  edges {
                  node {
                    entityId
                   displayName
                    isRequired
                    values {
                      edges {
                        node {
                          label
                         entityId
                        }
                      }
                    }
                  }
                }
    }`,
    variables: { "productId": productId }
  });

  var config = {
    method: 'post',
    url: '/graphql',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  try {
    let { data } = await axios(config)
    console.log({ data: data.data.site.product.variants.edges })
    let variantsEdge = data.data.site.product.variants.edges
    return variantsEdge.map(value => ({
      variantId: value.node.entityId,
      label: value.node.options.edges[0].node.values.edges[0].node.label,
      id: value.node.options.edges[0].node.values.edges[0].node.entityId,
      subscription: value.node.options.edges[0].node.values.edges[0].node.label == "One time purchase only" ? false : true,
      defeault_selected: value.node.options.edges[0].node.values.edges[0].node.label== "One time purchase only" ? true : false,
      attributeId: value.node.options.edges[0].node.entityId
    }))


  } catch (error) {
    console.log(error)
  }


}

import utils from '@bigcommerce/stencil-utils';


export const getCart = async () => {
    return await fetch('/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options', {
        method: "GET",
        credentials: "same-origin"
    }).then(function (response) {
        return response.json();
      }).then(function (data) {
          return data
    })
 };

 export const getCartSummary = async () => {
    return await fetch('/api/storefront/cart-summary', {
        method: "GET",
        credentials: "same-origin"
    }).then(function (response) {
        return response.json();
      }).then(function (data) {
          return data
    })
 };

export const createCart = async (lineItems) => {

    return await fetch('/api/storefront/carts', {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({lineItems: lineItems}),
    }).then(function (response) {
        return response.json();
      }).then(function (data) {
          return data
    })
}

 export const addCartItems = async (cartId, lineItems) => {

    return await fetch(`/api/storefront/carts/${cartId}/items`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({lineItems: lineItems}),
    }).then(function (response) {
        return response.json();
      }).then(function (data) {
          return data
    })
}

export const updateCartItem = async (cartId, itemId, lineItem) => {

    return await fetch(`/api/storefront/carts/${cartId}/items/${itemId}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"},
        body: JSON.stringify({lineItem: lineItem}),
    }).then(function (response) {
        return response.json();
      }).then(function (data) {
          return data
    })
}


export const deleteCartItem = async (cartId, itemId) => {

    return await fetch(`/api/storefront/carts/${cartId}/items/${itemId}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"}
    }).then(function (response) {
        return response.json();
      }).then(function (data) {
          return data
    })
}
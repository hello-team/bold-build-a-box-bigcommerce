import React from "react";
import {
    Button,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Form, InlineMessage } from '@bigcommerce/big-design'


export const CloseCart = (props) => {
    return (
        <Button variant="outlined" color="secondary" onClick={() => props.onClick()}>
            <ArrowBackIcon /> Keep building your box
        </Button>
    )
}

export const CartQuantityMessages = (props) => {
    return (
        <div>
            {props.selectedBox.max_qty < props.cartCount ?
                <InlineMessage type="error" messages={[{ text: 'You have added to many meals to this box!' }]} marginVertical="medium" />
                : ''}
            {props.selectedBox.max_qty > props.cartCount ?
                <InlineMessage type="info" messages={[{ text: `Please add ${props.selectedBox.max_qty - props.cartCount} more meals before you checkout` }]} marginVertical="medium" />
                : ''}
        </div>

    )
}

export const GetSubs = (cartItems, selectedBox) => {
    
    let subscriptionItems = cartItems.filter(cart_item => cart_item.options[0].value.includes('Subscribe'))
    console.log({ subscriptionItems: subscriptionItems })
   
    let formdata = []

    subscriptionItems.length !== 0 ? Promise.all(subscriptionItems.map((item, index) => {

        let subscription_group_id = selectedBox.subscription_group_id
        let interval_id = selectedBox.interval_id
        let interval_text = selectedBox.interval_text

        formdata.push({ name: `line_item_id`, index: index, value: `${item.id}` })
        formdata.push({ name: `interval_id`, index: index, value: parseInt(interval_id) })
        formdata.push({ name: `interval_text`, index: index, value: `${interval_text}` })
        formdata.push({ name: `subscription_group_id`, index: index, value: parseInt(subscription_group_id) })

    }))
        : ''


    return ({requestOptions: formdata})
}

export const GetCheckoutUrl = (customer) => {
    let localTime = new Date().getTime()
    let returnUrl = window.location.href
    let url = `https://checkout.staging.boldapps.net/boldplatform/proxy/begin-checkout?return_url=${returnUrl}&shop=store-xegfh.mybigcommerce.com&platform=bigcommerce&customer_id=${customer ? customer.id : ''}&checkout_local_time=${localTime}`
    return ({url: url})
}

export const CheckoutButton = (props) => {
    return (

        <Form action={props.url} method={'post'} >
            <input readOnly={true} key={'customer_jwt'} type='HIDDEN' name={`customer_jwt`} value={''} style={{ display: 'none' }} />
            <input readOnly={true} key={'cart_id'} type='HIDDEN' name={'cart_id'} value={props.cartId ? props.cartId : ''} style={{ display: 'none' }} />
            {props.requestOptions && props.requestOptions.length !== 0 ? props.requestOptions.map((x, index) => (
                <input readOnly={true} key={index} type='HIDDEN' name={`bold_cart_params[bold_subscriptions][line_items_subscription_info][${x.index}][${x.name}]`} value={x.value} style={{ display: 'none' }} />
            )) : ''}
            <Button
                key="checkout-button"
                type="submit"
                variant="contained"
                disabled={props.cartCount === props.selectedBox.max_qty ? false : true}
                style={{ width: '100%', backgroundColor: '#000', color: '#fff' }}
            >
                Checkout
           </Button>
        </Form>
    )
}
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import {
    Divider,
    Card,
    CardContent,
    SwipeableDrawer,
} from '@material-ui/core';


import { Grid, GridItem } from '@bigcommerce/big-design'
import CartHeader from './CartHeader'
import { CloseCart, CartQuantityMessages, GetSubs, GetCheckoutUrl, CheckoutButton } from './CartActions'
import { SubscriptionTitle, OneTimeItemTitle, CartQuantityActions, ItemImage, CartBoxOptions } from './CartItem'
const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '100%',
        displsy: 'flex',
    },
    list: {
        width: 500,
    },
    content: {
        flex: '1 0 auto',
    },
    cards: {
        width: 'auto',
    },

}))

export default function SideCart(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(true)
    const [checkoutData, setCheckoutData] = useState({})
    console.log({ cart: props })


    useEffect(() => {
        let cartId = props.cart ? props.cart[0].id : ''
        let { requestOptions } = GetSubs(props.cartItems, props.selectedBox)
        let { url } = GetCheckoutUrl(props.customer)
        setCheckoutData({ requestOptions: requestOptions, url: url, cartId: cartId })

    }, [props]);


    return (
        <div >
            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={() => { }}
                onOpen={() => { }}
            >
                <div
                    style={{ minWidth: props.minWidth }}
                    role="presentation"
                >
                    <CartHeader cartCount={props.cartCount} selectedBox={props.selectedBox} />
                    <Grid style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', justifyContent: 'center' }}>
                        <GridItem style={{ fontWeight: 'bold' }}>
                            <CloseCart onClick={() => props.setCartOpen(false)} />
                        </GridItem>
                        <CartQuantityMessages selectedBox={props.selectedBox} cartCount={props.cartCount} />
                        {checkoutData.cartId ?
                            <CheckoutButton url={checkoutData.url} cartId={checkoutData.cartId} requestOptions={checkoutData.requestOptions} cartCount={props.cartCount} selectedBox={props.selectedBox} />
                            : ''}

                        <GridItem style={{ width: '100%', border: 'solid 1px #000', padding: '.5rem', }}>
                            <CartBoxOptions handleSelectedBox={props.handleSelectedBox} selectedBox={props.selectedBox} boxes={props.boxes} />
                        </GridItem>
                        <GridItem>
                            {props.cartCount !== 0 ?
                                <Grid>
                                    {props.cartItems.map((row, indx) => (
                                        <GridItem key={`grid-item-${row.id}`} >
                                            <Card key={`${row.id}`} className={classes.root}>
                                                {row.subscriptionItem === true ? <SubscriptionTitle item={row} /> : <OneTimeItemTitle item={row} />}
                                                <Grid gridColumns="repeat(2, 1fr)">
                                                    <GridItem key={`grid-item-image-${row.id}`}>
                                                        <ItemImage item={row} />
                                                    </GridItem>
                                                    <GridItem key={`grid-item-actions-${row.id}`} >
                                                        <Divider />
                                                        <Grid gridAutoRows>
                                                            <CardContent key={row.name} className={classes.content}>
                                                                <GridItem key={`grid-item-actions-${row.id}`} style={{ display: 'inline-flex', marginBottom: 0 }}>
                                                                    <CartQuantityActions handleQntyRules={props.handleQntyRules} item={row} />
                                                                </GridItem>
                                                            </CardContent>
                                                            <Divider />

                                                        </Grid>
                                                    </GridItem>
                                                </Grid>
                                            </Card>
                                        </GridItem>
                                    ))}
                                </Grid>
                                : ''}
                        </GridItem>
                    </Grid>
                </div>


            </SwipeableDrawer>
        </div >
    );
}
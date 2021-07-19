import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import {
    Divider,
    Button,
    Input,
    Box,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Typography,
    SwipeableDrawer,
    LinearProgress
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import { Grid, Form, FormGroup, GridItem, Radio, InlineMessage } from '@bigcommerce/big-design'
import { normalizeFormData } from '../../theme/common/utils/api';



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '100%',
        displsy: 'flex',
    },
    list: {
        width: 500,
    },
    fullList: {
        width: 'auto',
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        textAlign: 'left',
        float: 'left',
        bottom: 0,
        paddingLeft: "1rem",
        paddingBottom: "1rem",
    },
    cards: {
        width: 'auto',
    },
    media: {
        maxWidth: 'auto',
    },

}))

export default function SideCart(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(true)
    const [checkoutData, setCheckoutData] = useState({})
    console.log({ cart: props })


    useEffect(() => {
        let cartId = props.cart ? props.cart[0].id : ''
        getSubs(props.cartItems, cartId)

    }, [props]);

    const getSubs = (cartItems, cartId) => {
        let localTime = new Date().getTime()
        let subscriptionItems = cartItems.filter(cart_item => cart_item.options[0].value.includes('Subscribe'))
        console.log({ subscriptionItems: subscriptionItems })
        //let formdata = new FormData();

        let formdata = []
        

        subscriptionItems.length !== 0 ? Promise.all(subscriptionItems.map((item, index) => {
            let product = props.variants.filter(prod => prod.id === item.productId)[0]

            let subscription_group_id = props.selectedBox.subscription_group_id
            let interval_id = props.selectedBox.interval_id
            let interval_text = props.selectedBox.interval_text
    
            formdata.push({ name: `line_item_id`, index: index, value: `${item.id}` })
            formdata.push({ name: `interval_id`, index: index, value: parseInt(interval_id) })
            formdata.push({ name: `interval_text`, index: index, value: `${interval_text}` })
            formdata.push({ name: `subscription_group_id`, index: index, value: parseInt(subscription_group_id) })
     
        }))
            : ''
        let urlName = window.location.href
        let url = `https://checkout.staging.boldapps.net/boldplatform/proxy/begin-checkout?return_url=${urlName}&shop=store-xegfh.mybigcommerce.com&platform=bigcommerce&customer_id=${props.customer ? props.customer.id : ''}&checkout_local_time=${localTime}`


        setCheckoutData({ url: url, requestOptions: formdata, cartId: cartId })

    }



    return (
        <div >
            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={() => { }}
                onOpen={() => { }}
            >
                <div
                style={{minWidth: props.minWidth}}
                    // className={classes.list}
                    role="presentation"
                >
                    <Card>
                        <CardHeader
                            title={<div><Typography component="h5" variant="h5" style={{ float: 'left' }} className={'product-title'}>
                                <em>COMPLETE YOUR BOX</em>
                            </Typography><Typography style={{ float: 'right' }}>
                                    <em>{props.cartCount} / {props.selectedBox.max_qty}</em>
                                </Typography></div>}
                        />
                        <CardContent>
                            <LinearProgress variant="determinate" value={parseInt(props.cartCount / props.selectedBox.max_qty * 100)} />
                        </CardContent>
                    </Card>
                    <Grid style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', justifyContent: 'center' }}>
                        <GridItem style={{ fontWeight: 'bold' }}>
                            <Button variant="outlined" color="secondary" onClick={() => props.setCartOpen(false)}>
                                <ArrowBackIcon /> Keep building your box
                        </Button>
                        </GridItem>
                        {props.selectedBox.max_qty < props.cartCount ? 
                        <InlineMessage type="error" messages={[{ text: 'You have added to many meals to this box!' }]} marginVertical="medium" />
                        : ''}
                        {props.selectedBox.max_qty > props.cartCount ? 
                        <InlineMessage type="info" messages={[{ text: `Please add ${props.selectedBox.max_qty - props.cartCount} more meals before you checkout` }]} marginVertical="medium" />
                        : ''}
                        {props.selectedBox.max_qty == props.cartCount ? <Form action={checkoutData.url} method={'post'} >
                    <input readOnly={true} key={'customer_jwt'} type='HIDDEN' name={`customer_jwt`} value={''} style={{ display: 'none' }} />
                    <input readOnly={true} key={'cart_id'} type='HIDDEN' name={'cart_id'} value={checkoutData.cartId ? checkoutData.cartId : ''} style={{ display: 'none' }} />
                    {checkoutData.requestOptions && checkoutData.requestOptions.length !== 0 ? checkoutData.requestOptions.map((x, index) => (
                        <input readOnly={true} key={index} type='HIDDEN' name={`bold_cart_params[bold_subscriptions][line_items_subscription_info][${x.index}][${x.name}]`} value={x.value} style={{ display: 'none' }} />
                    )) : ''}
                    <Button
                        key="checkout-button"
                        type="submit"
                        variant="contained"
                        disabled={props.cartCount === props.selectedBox.max_qty ? false: true}
                        style={{ width: '100%', backgroundColor: '#000', color: '#fff' }}
                    >
                        Checkout
                  </Button>
                </Form> : ''}

                        <GridItem style={{ width: '100%', border: 'solid 1px #000', padding: '.5rem', }}>

                            <Grid gridColumns={`repeat(3, 1fr)`} >
                                {props.boxes.map(row => (
                                    <GridItem key={`grid-${row.name}`} >
                                        {row.name === props.selectedBox.name ?
                                            <Button variant="contained" style={{ width: '100%', backgroundColor: '#000', color: '#fff' }} onClick={() => props.handleSelectedBox(row)}>
                                                {row.max_qty} items
                                            </Button>
                                            : <Button variant="outlined" style={{ width: '100%', color: '#000' }} onClick={() => props.handleSelectedBox(row)}>
                                                {row.max_qty} items
                                 </Button>}

                                    </GridItem>
                                ))}
                            </Grid>
                        </GridItem>
                        <GridItem>
                            {props.cartCount !== 0 ?
                                <Grid>
                                    {props.cartItems.map((row, indx) => (
                                        <GridItem key={`grid-item-${row.id}`} >
                                            <Card key={`${row.id}`} className={classes.root}>
                                                <CardHeader
                                                    title={<div>
                                                        {row.subscriptionItem === true ?
                                                            <Typography key={"title"} style={{ float: 'left' }} className={'product-title'}>
                                                                <em style={{ color: 'red' }} >{row.interval_text}</em><em style={{ color: 'red' }} > Subscription!</em>
                                                                <br />
                                                                <em>{row.name}</em> <br />

                                                            </Typography>
                                                            : <Typography key={"title"} style={{ float: 'left' }} className={'product-title'}>
                                                                <em>{row.name}</em> <br />

                                                            </Typography>
                                                        }
                                                        {row.listPrice !== props.selectedBox.price_per_item ?
                                                            <Typography key={"price"} style={{ float: 'right' }}>
                                                                <span style={{ textDecoration: 'line-through red', paddingRight: '1vw' }}>
                                                                    ${row.listPrice}
                                                                </span>
                                                                <span>
                                                                    ${props.selectedBox.price_per_item}
                                                                </span>

                                                            </Typography>
                                                            : <Typography key={"price"} style={{ float: 'right' }}>
                                                                ${props.selectedBox.price_per_item}
                                                            </Typography>
                                                        }
                                                    </div>}
                                                />
                                                <Grid gridColumns="repeat(2, 1fr)">
                                                    <GridItem key={`grid-item-image-${row.id}`}>
                                                        <CardMedia
                                                            component="img"
                                                            className={classes.media}
                                                            src={row.imageUrl}
                                                            alt={row.name}
                                                            key={`image-${row.id}`}
                                                        />
                                                    </GridItem>
                                                    <GridItem key={`grid-item-actions-${row.id}`} >
                                                        <Divider />
                                                        <Grid gridAutoRows>
                                                            <CardContent key={row.name} className={classes.content}>
                                                                <GridItem key={`grid-item-actions-${row.id}`} style={{ display: 'inline-flex', marginBottom: 0 }}>
                                                                    <span className={'MuiButtonBase-root'}>
                                                                        <RemoveIcon onClick={() => props.handleQntyRules(row, parseInt(row.quantity - 1))} />
                                                                    </span>

                                                                    <span className={'MuiButtonBase-root'}>
                                                                        <Typography data-cart-totals data-product-id={row.id}>
                                                                            {row.quantity}
                                                                        </Typography>
                                                                    </span>
                                                                    <span className={'MuiButtonBase-root'}>
                                                                        <AddIcon onClick={() => props.handleQntyRules(row, parseInt(row.quantity + 1))} />
                                                                    </span>
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
import React, { useState, useEffect } from "react";
import { Button, Typography, CssBaseline, Card, CardMedia, CardContent } from "@material-ui/core";
import { Grid, Form, FormGroup, GridItem, Radio } from '@bigcommerce/big-design'
import { makeStyles } from '@material-ui/styles';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import './items.css';
import { formatMoney } from 'accounting';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        displsy: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    media: {
        height: '100%',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: "1rem",
        paddingBottom: "1rem",
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    backdrop: {
        color: '#fff',
    },
}));


export default function BoxItems(props) {
    const classes = useStyles();
    const [boldItem, setBoldItem] = useState({})
    const [isDisabled, setDisabled] = useState(true)


    const handleChange = (option) => {
        let item = { ...boldItem }
        item.selected_option = option
        setBoldItem(item)

    }

    useEffect(() => {
        if (!boldItem.id) {
            let item = props.item
            console.log(item.price)
            setBoldItem(item)
        }

    }, [props]);


    const changeQnty = (qty) => {
        console.log(qty, boldItem)
        let item = { ...boldItem }
        item.qty = qty

        if (item.qty >= 0 && item.qty <= props.limitQty) {
            setBoldItem(item)
            setDisabled(false)
        }
        if (qty === 0) {
            setDisabled(true)
        }
    }


    return (
        <>
            <Card key={`${boldItem.id}`} className={classes.root}>
                <CardMedia
                    component="img"
                    className={classes.media}
                    src={boldItem.image ? boldItem.image.data : ''}
                    key={`image-${boldItem.id}`}

                />
                <div className={classes.details}>
                    <CardContent key={boldItem.name} className={classes.content}>
                        <div>
                            <Typography className={'product-title'}>
                                {boldItem.name}
                            </Typography>
                            <br />
                            {boldItem.selected_option && boldItem.selected_option.subscription === true ?
                                <Typography variant="subtitle1" color="textSecondary">
                                    {boldItem.price ?
                                        <em>
                                            <span style={{ textDecoration: 'line-through red', paddingRight: '1vw' }}>
                                                {formatMoney(boldItem.price.non_sale_price_without_tax.value)}
                                            </span>
                                            <span>
                                                {formatMoney(boldItem.price.without_tax.value)}
                                            </span>
                                        </em>
                                        : 0}
                                </Typography>
                                : <Typography variant="subtitle1" color="textSecondary">
                                    {boldItem.price ? formatMoney(boldItem.price.non_sale_price_without_tax.value) : 0}

                                </Typography>}
                        </div>
                        <div className={classes.controls}>
                            <Form >
                                <FormGroup>
                                    <input type="hidden" name="id" value={boldItem.id} />
                                </FormGroup>
                                <FormGroup>

                                    <Grid gridAutoRows>
                                        <GridItem key={`grid-item-actions-${boldItem.id}`} style={{ display: 'inline-flex', marginBottom: 0 }}>
                                        <em>

                                            <span className={'MuiButtonBase-root'}>
                                                <RemoveIcon onClick={() => changeQnty(parseInt(boldItem.qty ? boldItem.qty : 0) - 1)} />
                                            </span>
                                            <span className={'MuiButtonBase-root'}>
                                                {boldItem.qty ? boldItem.qty : 0}
                                            </span>
                                            <span className={'MuiButtonBase-root'}>
                                                <AddIcon onClick={() => changeQnty(parseInt(boldItem.qty ? boldItem.qty : 0) + 1)} />
                                            </span>
                                            </em>

                                        </GridItem>
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    {boldItem.options ? boldItem.options.map((x, index) => (
                                        <Radio key={`${x.attributeId}:${x.id}`}
                                            data-productid={boldItem.id}
                                            data-attributeid={x.attributeId}
                                            label={x.label}
                                            checked={boldItem.selected_option.id === x.id ? true : false}
                                            value={boldItem.selected_option.id === x.id ? true : false}
                                            onChange={() => handleChange( x)} />
                                    )) : ''}

                                </FormGroup>
                                <FormGroup>
                                    <Button id={'add-to-cart'} disabled={isDisabled} variant="contained" onClick={() => {
                                        props.handleAdd(boldItem, boldItem.qty, boldItem.selected_option)
                                        changeQnty(parseInt(boldItem.qty ? boldItem.qty : 0) - boldItem.qty)
                                    }}
                                        style={{ backgroundColor: '#fff', borderColor: '#84dda7', color: '#84dda7', fontWeight: 'bold', marginBottom: '.5vw' }}>
                                        Add To Cart
                            </Button>

                                </FormGroup>
                            </Form>


                        </div>
                    </CardContent>


                </div>
            </Card>
        </>
    )

}
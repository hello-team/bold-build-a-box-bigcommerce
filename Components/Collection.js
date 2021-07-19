import React, { useState, useEffect } from "react";
import { Button, AppBar, Toolbar } from "@material-ui/core";
import { Grid, GridItem } from '@bigcommerce/big-design'
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ChooseBox from '../Boxes/boxes'
import BoxItems from '../Items/items'
import SideCart from '../Cart/SideCart'
import utils from '@bigcommerce/stencil-utils';
import graphqlOptipns from '../graphql-options'
import {getCart, getCartSummary, createCart, addCartItems, updateCartItem, deleteCartItem} from '../Cart/CartApi'
import { normalizeFormData } from '../../theme/common/utils/api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
}))


function getSteps() {
  return ['Choose plan', 'Select meals', 'Checkout'];
}


export default function Collection(props) {
  const classes = useStyles();
  const steps = getSteps();
  const [cart, setCart] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [step, setStep] = useState(0)
  const [selectedBox, setSelectedBox] = useState({})

  const [boxes, setBoxes] = useState([{ name: 'small', qty: 0, max_qty: 9, savings: 0, selected: false }, { name: 'medium', qty: 0, max_qty: 14, savings: 10, selected: false }, { name: 'large', qty: 0, max_qty: 24, savings: 20, selected: false }])

  const [variants, setVariants] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [itemAdded, setItemAdded] = useState(0)
  const [limitQty, setLimitQty] = useState(0)
  const [width, setWindowWidth] = useState(0)

  useEffect(() => {

    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () =>
      window.removeEventListener('resize', updateDimensions);
  }, [])
  const updateDimensions = () => {
    setWindowWidth(document.querySelector('#bold-box-kit').offsetWidth)
    console.log(document.querySelector('#bold-box-kit').offsetWidth)
  }


  useEffect(() => {

    console.log(props)
    if (variants.length === 0 && props.feed && props.feed.category) {
      console.log(props)

      let token = ''
      mapProds(props.feed.category.products, props.feed.storefrontAPIToken)
      setCustomer(props.feed.customer)
      setItemAdded(new Date().toLocaleTimeString())
    }

  }, [props]);

  const mapProds = async (products, token) => {
    let prods = await Promise.all(products.map(async (product) => {

      let options = await graphqlOptipns(token, product.id)
      product.options = options
      console.log(options)
      product.image.data = product.image.data.replace('/{:size}/', "/320w/")
      product.selected_option = options.filter(option => option.defeault_selected === true)[0]
      return product
    }))

    console.log({ prods: prods })
    setVariants(prods)

  }

  useEffect(() => {

    if (cartCount === selectedBox.max_qty) {
      setCartOpen(true)
    }
    setLimitQty(selectedBox.max_qty - cartCount)

  }, [cartCount]);

  useEffect(() => {

    (async () => {
      console.log('Log Cart');


      let dataCart = await getCart()
      console.log({dataCart: dataCart})

      let items = dataCart.length !== 0 && dataCart[0].lineItems.physicalItems ? dataCart[0].lineItems.physicalItems.map(x => {
        let prod = props.feed.category.products.filter(item => item.id === x.productId)[0]

        let subscription_group_id = prod.custom_fields.filter(field => field.name === "subscription_group_id")[0].value
        let interval_id = prod.custom_fields.filter(field => field.name === "interval_id")[0].value
        let interval_text = prod.custom_fields.filter(field => field.name === "interval_name")[0].value

        x.listPrice = prod.price.non_sale_price_without_tax.value
        x.subscriptionItem = x.options[0].value.includes('Subscribe') ? true : false
        if (x.subscriptionItem === true) {
          x.subscription_group_id = subscription_group_id
          x.interval_id = interval_id
          x.interval_text = interval_text
        }

        return x
      }) : []
      console.log({ collection: props })

     let cartData = dataCart.length == 0 ? null : dataCart

      setCart(cartData)
      setCartItems(items)

      let cartSummary = await getCartSummary()
      setCartCount(cartSummary ? cartSummary.total_quantity ? cartSummary.total_quantity : 0 : 0)

    })()

  }, [props, itemAdded]);




  const handleNewStep = (e) => {
    setStep(e)
  }

  const handleSelectedBox = (e) => {
    let items = boxes.map(box => {
      if (box.name === e.name) {
        setSelectedBox(box)
        setStep(1)
        setLimitQty(box.max_qty - cartCount)

        return { ...box, selected: true };
      } else {
        return { ...box, selected: false }
      }
    })
    setBoxes(items)
  }


  const handleAdd = (item, qty) => {

    console.log(item.selected_option)
    let newQty = qty
    let formdata = new FormData();

     
    formdata.append("action", "add");
    formdata.append("product_id", item.id);
    formdata.append(`attribute[${item.selected_option.attributeId}]`, item.selected_option.id)
    if (parseInt(newQty + selectedBox.qty) > selectedBox.max_qty) {
      let fixedQty = parseInt(selectedBox.max_qty - selectedBox.qty)
      formdata.append(`qty[]`, fixedQty);
    } else {
      formdata.append(`qty[]`, newQty);
    }

    utils.api.cart.itemAdd(normalizeFormData(formdata), (err, response) => {
      if (response) {
        console.log({ newQty: newQty })
        setItemAdded(new Date().toLocaleTimeString())
        return response.data
      } else {
        console.log({ err: err })
      }

    })

  }



  const handleQntyRules = (item, newQty) => {
    console.log(item, newQty)
    if (newQty < 1) {
      utils.api.cart.itemRemove(item.id, (err, response) => {
        console.log({ remove: response })
        setItemAdded(new Date().toLocaleTimeString())
      })
    } else {
      utils.api.cart.itemUpdate(item.id, newQty, (err, response) => {
        console.log({ update: response })
        setItemAdded(new Date().toLocaleTimeString())
      })
    }

  }



  return (
    <div style={{ paddingTop: '2vw', justifyContent: 'center' }}>

      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel onClick={() => handleNewStep(index)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {cartOpen === false ?
        <AppBar position="static" style={{ backgroundColor: "#000", textAlign: 'right', minWidth: width  }}>
          <div style={{ padding: '1vw', backgroundColor: "#000", textAlign: 'right', minWidth: width }}>

            <Button
              color="inherit"
              onClick={() => setCartOpen(true)}
              style={{ maxWidth: '15vw', padding: '1vw', borderStyle: 'solid', borderWidth: '2px', borderColor: '#fff', backgroundColor: "#000" }}>
              Your Box | {cartCount} / {selectedBox.max_qty ? selectedBox.max_qty : 0}
            </Button>
          </div>

        </AppBar>
        : <SideCart cartOpen={cartOpen} cart={cart} cartCount={cartCount} cartItems={cartItems} customer={customer}
          variants={variants}
          boxes={boxes}
          selectedBox={selectedBox}
          handleQntyRules={(line, newQty) => handleQntyRules(line, newQty)}
          handleSelectedBox={(val) => handleSelectedBox(val)}
          setCartOpen={(val) => setCartOpen(val)}
        />}

      {step === 0 ?
        <div style={{ alignItems: 'center' }}>
          <Grid gridColumns={width > 900 ? `repeat(3, 1fr)` : `repeat(1, 1fr)`}>
            {boxes.map(row => (
              <GridItem key={`grid-${row.name}`} onClick={() => handleSelectedBox(row)}>
                <ChooseBox 
                box={row}
                minWidth={width > 900 ? Math.round(width/3) : width} />
              </GridItem>
            ))}
          </Grid>
        </div>

        : ''}
      {step === 1 ?
        <div style={{ marginTop: '2vw' }}>
          <Grid gridColumns={width > 900 ? `repeat(3, 1fr)` : width < 640 ? `repeat(1, 1fr)` : `repeat(2, 1fr)`}>
            {variants.length !== 0 ? variants.map(row => (
              <GridItem key={`grid-${row.id}`}>
                {console.log({ row: row.id })}
                <BoxItems item={row} limitQty={limitQty} selectedBox={selectedBox} 
                minWidth={width > 900 ? Math.round(width/3) : width}
                handleAdd={(item, qty) => handleAdd(item, qty)} />
              </GridItem>
            )) : ''}
          </Grid>
        </div>
        : ''}
    </div>
  )

}
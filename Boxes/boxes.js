import React, { useState, useEffect } from "react";
import { Divider, Typography, Card, CardHeader, CardContent, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import './boxes.css';
import { formatMoney } from 'accounting';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        marginTop: '2rem',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderColor: '#000',
        boxShadow: 'inset 0 1px 1px rgb(0 0 255 / 0%)',
        color: '#333'
    },
    content: {
        flex: '1 0 auto',
    },


}));


export default function ChooseBox(props) {
    const classes = useStyles();
    const [selected, setSelected] = useState(false)



    useEffect(() => {
        if (selected === true) {
            props.handleSelectedBox(props.box)
        }
    }, [selected]);

    return (
        <Card key={`${props.box.name}`} className={classes.root} style={{ minWidth: props.minWidth, maxWidth: props.minWidth }}>
            <div className={classes.details}>
                <CardContent key={props.box.name} >
                    <Typography component="h5" variant="h5" className={'box-title'}>
                        {props.box.name}
                    </Typography>
                    <Divider />

                    <Typography color="textSecondary">
                        per month
                     </Typography>
                    <Typography color="textSecondary">
                        {formatMoney(props.box.price_per_item)} / meal
                     </Typography>
                    <Button variant="contained" style={{ width: '100%', backgroundColor: '#000', color: '#fff' }} onClick={() => props.handleSelectedBox(props.box)}>
                        Choose
                    </Button>
                </CardContent>
            </div>
        </Card>
    )

}
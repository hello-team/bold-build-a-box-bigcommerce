import React, { useState, useEffect } from "react";
import { Divider, Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import './boxes.css';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        marginTop: '2rem',
    },
    content: {
        flex: '1 0 auto',
    },


}));


export default function ChooseBox(props) {
    const classes = useStyles();
    const [selected, setSelected] = useState(false)
    

    
    useEffect(() => {
        if(selected === true){
            props.handleSelectedBox(props.box)
        }
    }, [selected]);

    return (
        <Card key={`${props.box.name}`} className={classes.root} style={{minWidth: props.minWidth , maxWidth: props.minWidth}}>
            <div className={classes.details}>
                <CardContent key={props.box.name} >
                    <Typography component="h5" variant="h5" className={'box-title'}>
                        {props.box.name}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {props.box.max_qty} items
                                        </Typography>
                    <Divider />
                    <Typography variant="subtitle1" color="textSecondary">
                        ${props.box.savings} savings
                                        </Typography>
                </CardContent>
            </div>
        </Card>
    )

}
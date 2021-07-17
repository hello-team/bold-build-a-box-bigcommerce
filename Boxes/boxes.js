import React, { useState, useEffect } from "react";
import { Divider, Typography, Card, CardContent } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import './boxes.css';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        displsy: 'flex',
        marginTop: '2rem',
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


export default function ChooseBox(props) {
    const classes = useStyles();
    const [selected, setSelected] = useState(false)
    

    
    useEffect(() => {
        if(selected === true){
            props.handleSelectedBox(props.box)
        }
    }, [selected]);

    return (
        <Card key={`${props.box.name}`} className={classes.root}>
            <div className={classes.details}>
                <CardContent key={props.box.name} className={classes.content}>
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
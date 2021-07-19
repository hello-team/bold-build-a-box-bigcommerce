import React from "react";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    LinearProgress
} from '@material-ui/core';



export default function CartHeader(props) {
    return (
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
        )
}

import {FC} from "react";

interface Props {
    id:string,
    className?: string
}

const Icon: FC<Props> = ({id, className}) => {
    return (
        <img src={`${process.env.API_URL}/public/icons/${id}.png`} alt={id} className={className || ""}/>
    );
};

export {Icon};
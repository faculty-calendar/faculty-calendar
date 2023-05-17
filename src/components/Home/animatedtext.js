import React from "react";
import {motion} from "framer-motion";

const AnimatedText = ({text}) => {
    const words = text.split(" ");


    const container01 = {
        hidden: { opacity: 0},
        visible: (i=1) => ({ 
            opacity: 1, 
            transition: {staggerChildren: 0.12, delaychildren: i * 0.04},
        })
    }
    
    const child = {
        visible:{
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                type : "spring",
                damping : 12,
                stiffness : 100,
        },
    },
        hidden: {
            opacity: 0,
            y: -20,
            x:20,
            transition: {
                type : "spring",
                damping : 12,
                stiffness : 100,
            }, 
        },
    };


    return (
        <motion.div style ={{overflow:"hidden", display: "flex"}} variants={container01} initial="hidden" animate = "visible">
            {words.map((words, index) => (
                <motion.span 
                variants = {child}
                style ={{marginRight: "5px",color: "black",textAlign: "center"}}
                key={index}
                 >
                    <h1>{words}</h1>
                </motion.span>
            ))}
        </motion.div>
    );
}
export default AnimatedText;
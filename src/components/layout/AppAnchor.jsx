import React, {useState} from "react";
import {Anchor, FloatButton} from "antd";
import {LeftCircleOutlined, RightCircleOutlined} from "@ant-design/icons";


const AppAnchor = ({
                       items,
                       offsetTop = 0,
                       span,
                       setSpan,
                       anchorButtonStyle = {top: 350, left: 10, right: 'auto', bottom: 'auto'}
                   }) => {
    const [anchorVisible, setAnchorVisible] = useState(true);
    const toggleVisibility = () => {
        setAnchorVisible(!anchorVisible);
        setSpan(span === 20 ? 24 : 20)
    }

    return (
        <>
            <FloatButton onClick={() => toggleVisibility()} style={anchorButtonStyle}
                         tooltip={anchorVisible ? <div>Hide Sidebar</div> : <div>Show Sidebar</div>}
                         icon={anchorVisible ? <LeftCircleOutlined/> : <RightCircleOutlined/>}
            />

            {anchorVisible &&
                <Anchor offsetTop={offsetTop} items={items}/>
            }
        </>
    );
};

export default AppAnchor;

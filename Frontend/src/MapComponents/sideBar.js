import {Menu, Sidebar} from "react-pro-sidebar";
import React from "react";

const SideBarComponent = () => {
    return (
        <Sidebar className="sideBar" style={{visibility: "hidden"}}>
            <Menu>
            </Menu>
        </Sidebar>
    );
}

export default SideBarComponent;
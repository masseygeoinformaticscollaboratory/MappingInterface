import {Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import React from "react";
import  './MapStyle/sideBarStyle.css';



function SideBarComponent(props) {

    return (

        <Sidebar className="sideBar" collapsedWidth={'0px'} width={'15vw'} defaultCollapsed='True'>
            <Menu>
               <MenuItem

                   onClick={() => {
                       props.collapseSidebar(true);
                       props.mapElement.current.style.width = '95vw'

                   }}>
               ✖

               </MenuItem>
            </Menu>
        </Sidebar>

    );
}


export default SideBarComponent;
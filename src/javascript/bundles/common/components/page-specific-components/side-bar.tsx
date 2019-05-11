import * as React from 'react';
import "../../styles/page/side-bar.scss";
import { IoIosDesktop, IoIosFolder, IoMdClose } from "react-icons/io";
import { MdFullscreen } from 'react-icons/md';
import {Routes} from "../../routing/routing";

export interface ISidebarItem {
  name: string;
  icon: React.ReactElement;
  route?: Routes;
}

export const SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    name: "Dashboard",
    route: Routes.HOME,
    icon: <IoIosDesktop />
  },
  {
    name: "Library",
    icon: <IoIosFolder />
  },
  {
    name: "Maximize",
    icon: <MdFullscreen />
  },
  {
    name: "Close",
    icon: <IoMdClose />
  },
];

export interface SideBarProps {
  active?: string;
  route: (route: Routes) => void
}

export const SideBar: React.FunctionComponent<SideBarProps> = ({ active, route }): JSX.Element => (
  <aside className="side-bar">
    {SIDEBAR_ITEMS.map(item => (
      <div className={`item ${active === item.name && 'active'}`} key={item.name} onClick={() => active !== item.name && item.route && route(item.route)}>
        <div className="icon">{item.icon}</div>
        <div className="label">{item.name}</div>
      </div>
    ))}
  </aside>
);
import './style.css'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from '@/store'
import { Children } from 'react'

type MenuItem = Required<MenuProps>['items'][number]
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

function Sidebar() {
  const userInfo = useSelector((state: AppState) => state.dashboard.userInfo)

  const defaultOpenKeys =
    userInfo.menulist.length > 0 ? [userInfo.menulist[0].menu_id + ''] : []

  const genMenu = (menus: any) => {
    return menus.map((item: any) => {
      return {
        key: item.menu_id,
        label: <Link to={item.menu_path}>{item.menu_name}</Link>,
        icon: item.menu_icon ? <i className={item.menu_icon}></i> : null,
        children: item.sub_menu ? genMenu(item.sub_menu) : null
      }
    })
    // return[
    //   {key: 1, label: '1'},
    //   {key: 2, label: '2'},
    //   {key: 3, label: '3'},
    //   {key: 4, label: '4'},
    // ]
    // if (!menus) {
    //   return menus.map((item: any) => {
    //     return {
    //       key: item.menu_id,
    //       lable: <Link to={item.menu_path}>{item.menu_name}</Link>,
    //       icon: item.menu_icon ? <i className={item.menu_icon}></i> : null
    //     }
    //   })
    // } else {
    //   return null
    // }
  }

  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        theme="dark"
        defaultOpenKeys={defaultOpenKeys}
        items={genMenu(userInfo.menulist)}
      ></Menu>
    </div>
  )
}
export default Sidebar

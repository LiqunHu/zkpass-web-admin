import './style.css'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AppState } from '@/store'

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

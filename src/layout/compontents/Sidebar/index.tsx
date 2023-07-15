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
    return menus.map((item: any) =>
      item.sub_menu.length === 0 ? (
        <Menu.Item key={item.menu_id}>
          <Link to={item.menu_path}>{item.menu_name}</Link>
        </Menu.Item>
      ) : (
        <Menu.SubMenu
          key={item.menu_id}
          title={item.menu_name}
          icon={item.menu_icon ? <i className={item.menu_icon}></i> : null}
        >
          {genMenu(item.sub_menu)}
        </Menu.SubMenu>
      )
    )
  }

  return (
    <div className="sidebar">
      <Menu mode="inline" theme="dark" defaultOpenKeys={defaultOpenKeys}>
        {genMenu(userInfo.menulist)}
      </Menu>
    </div>
  )
}
export default Sidebar

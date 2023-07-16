import './style.css'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, Menu, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Link } from 'react-router-dom'
import { AppState } from '@/store'
import { changeCollapse } from '@/store/dashboardSlice'

function Header() {
  const dispatch = useDispatch()
  const collapse = useSelector((state: AppState) => state.dashboard.collapse)
  const userInfo = useSelector((state: AppState) => state.dashboard.userInfo)
  const [messageCount] = useState(1)

  const handleChangeCollapse = () => {
    dispatch(changeCollapse(!collapse))
  }

  const items: MenuProps['items'] = [
    {
      key: 'mail',
      label: <a target="_blank">项目仓库</a>
    },
    {
      key: 'personal',
      label: <a target="_blank">个人中心</a>
    },
    {
      key: 'exit',
      label: '退出登录'
    }
  ]

  return (
    <div className="header">
      <div className="collapse-btn" onClick={handleChangeCollapse}>
        {collapse ? (
          <i className="fa-solid fa-bars"></i>
        ) : (
          <i className="fa-solid fa-bars-staggered"></i>
        )}
      </div>
      <div className="logo">管理系统</div>
      <div className="header-right">
        <div className="header-user-con">
          <div className="btn-bell">
            <Tooltip
              title={messageCount ? `有${messageCount}条未读消息` : `消息中心`}
              placement="bottom"
            >
              <Link to="/tabs">
                <i className="fa-regular fa-bell"></i>
              </Link>
            </Tooltip>
            {messageCount ? <span className="btn-bell-badge"></span> : null}
          </div>

          <div className="user-avator">
            <img src={userInfo.avatar} />
          </div>
          <Dropdown className="user-name" menu={{ items }}>
            <span className="el-dropdown-link">
              {userInfo.name}
              <i className="el-icon-caret-bottom"></i>
            </span>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
export default Header

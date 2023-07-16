import './style.css'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Menu, Dropdown } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { AppState } from '@/store'
import { setTagsItem, delTagsItem } from '@/store/dashboardSlice'
import { getCurrentRouter } from '@/routers'

function Tags() {
  const dispatch = useDispatch()
  const tagsList = useSelector((state: AppState) => state.dashboard.tagsList)
  const location = useLocation()

  const clickItem = (item: any) => {
    console.log(`Click on item ${item}`)
  }

  const menu = (
    <Menu onClick={clickItem}>
      <Menu.Item key="other">关闭其他</Menu.Item>
      <Menu.Item key="all">关闭所有</Menu.Item>
    </Menu>
  )

  const genTags = () => {
    return tagsList.map((item, index) => (
      <li className="tags-li" key={index}>
        <Link to={item.path} className="tags-li-title">
          {item.title}
        </Link>
        <span className="tags-li-icon">
          <i className="fa-solid fa-xmark"></i>
        </span>
      </li>
    ))
  }

  const setTags = (route: any) => {
    const isExist = tagsList.some((item: any) => {
      return item.path === route.path
    })
    if (!isExist) {
      if (tagsList.length >= 8) {
        dispatch(delTagsItem({ index: 0 }))
      }
      dispatch(setTagsItem({title: route.title, path: route.path}))
    }
  }

  useEffect(() => {
    let router = getCurrentRouter(location.pathname)
    if(router) {
      setTags({
        title: router.title,
        path: location.pathname
      })
    }
  }, [location])

  return (
    <div className="tags">
      <div className="tags-body">
        <ul>{genTags()}</ul>
        <div className="tags-close-box">
          <Dropdown dropdownRender={()=>menu}>
            <Button size="small" type="primary">
              标签选项
              <i className="m-l-5 fa-solid fa-angle-down"></i>
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}
export default Tags

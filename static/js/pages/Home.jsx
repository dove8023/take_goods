/* 左侧导航 */

let React = require("react");
let ReactDOM= require("react-dom");
import { Router , Route , Link , IndexLink , browserHistory , hashHistory } from 'react-router';

module.exports = ({ children }) => (
    <div>
        <ul className="index_manage fl">
            <li>
                <IndexLink to="/">首页</IndexLink>
            </li>
            <li>
                <Link activeClassName="active" to="/receive">收货界面</Link>
            </li>
            <li>
                <Link activeClassName="active" to="/order">交易查看界面</Link>
            </li>
            <li>
                <Link activeClassName="active" to="/type">品种管理</Link>
            </li>
            <li>
                <Link activeClassName="active" to="/stats">数据统计</Link>
            </li>
            <li>
                <a href="/api/loginout">退出</a>
            </li>
        </ul>
        <div className="index_Box">
            {children} 
        </div> 
    </div>
);